# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

import asyncio
import threading
import unittest
from pathlib import Path
from types import SimpleNamespace

from e2e.visual.cli import profile_passed, start_backend


class ProfilePassedTest(unittest.TestCase):
    def test_passes_when_every_scenario_was_compared(self):
        summary = {"01-a": {"verdict": "same"}, "02-b": {"verdict": "changed"}}
        self.assertTrue(profile_passed(summary, []))

    def test_fails_on_a_failed_or_missing_scenario(self):
        self.assertFalse(profile_passed({"01-a": {"verdict": "same"}}, ["head 01-a: missing text: A"]))
        self.assertFalse(profile_passed({"01-a": {"verdict": "missing"}}, []))


class StartBackendTest(unittest.TestCase):
    def test_a_cancelled_start_stops_the_server_it_returns(self):
        release = threading.Event()
        stopped = threading.Event()
        server = SimpleNamespace(stop=stopped.set)
        profile = SimpleNamespace(open=lambda *_: (release.wait(5), SimpleNamespace(server=server))[1])

        async def scenario():
            task = asyncio.create_task(start_backend(profile, None, Path("."), Path(".")))
            await asyncio.sleep(0.05)
            task.cancel()
            await asyncio.sleep(0.05)
            # The start is still running; it ends after the cancellation
            release.set()
            with self.assertRaises(asyncio.CancelledError):
                await task

        asyncio.run(scenario())
        self.assertTrue(stopped.is_set())

    def test_a_start_that_completes_returns_the_running_backend(self):
        running = SimpleNamespace(server=SimpleNamespace(stop=lambda: None))
        profile = SimpleNamespace(open=lambda *_: running)
        self.assertIs(asyncio.run(start_backend(profile, None, Path("."), Path("."))), running)


if __name__ == "__main__":
    unittest.main()
