# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

import tempfile
import unittest
from pathlib import Path
from unittest import mock

from e2e.fixtures.seed import api_server_config, node_settings
from e2e.visual import backend
from e2e.visual.backend import FLAVORS, BackendChoice, _download_release, _version


class VersionTest(unittest.TestCase):
    def test_takes_the_version_from_the_first_line(self):
        self.assertEqual(_version("kamu 0.271.0\n"), "0.271.0")
        self.assertEqual(_version("kamu-api-server 0.94.0\nbuilt with rustc\n"), "0.94.0")


class ApiServerConfigTest(unittest.TestCase):
    def test_the_accounts_become_a_password_provider_next_to_github(self):
        cli_config, env = node_settings()
        config = api_server_config(cli_config, env)
        password, github = config["auth"]["providers"]
        self.assertEqual(password["kind"], "password")
        self.assertEqual([a["accountName"] for a in password["accounts"]], ["kamu", "alice", "bob"])
        self.assertEqual(github["kind"], "github")
        self.assertEqual(config["auth"]["jwtSecret"], env["KAMU_JWT_SECRET"])

    def test_the_rest_of_the_node_settings_carry_over(self):
        cli_config, env = node_settings()
        config = api_server_config(cli_config, env)
        self.assertEqual(config["identity"], cli_config["content"]["identity"])
        self.assertEqual(config["engine"], cli_config["content"]["engine"])
        self.assertTrue(config["secretsEncryption"]["enabled"])


class BackendChoiceTest(unittest.TestCase):
    def test_a_build_is_named_by_release_image_or_binary_only(self):
        cache = Path(tempfile.gettempdir())
        self.assertFalse(BackendChoice("cli", cache).named())
        self.assertFalse(BackendChoice("api-server", cache, migrations="m").named())
        self.assertTrue(BackendChoice("cli", cache, release="0.271.0").named())
        self.assertTrue(BackendChoice("api-server", cache, image="0.94.0").named())

    def test_nothing_is_resolved_until_asked(self):
        with mock.patch.object(backend, "resolve_backend") as resolve:
            choice = BackendChoice("api-server", Path(tempfile.gettempdir()), image="0.94.0")
            self.assertEqual(choice.kind, "api-server")
            resolve.assert_not_called()


class ReleaseTest(unittest.TestCase):
    def test_a_platform_without_releases_is_refused_with_the_alternatives(self):
        with (
            mock.patch.object(backend.platform, "system", return_value="Darwin"),
            mock.patch.object(backend.platform, "machine", return_value="arm64"),
        ):
            with self.assertRaisesRegex(RuntimeError, r"Linux x86_64 only.*--bin.*--image"):
                _download_release(FLAVORS["api-server"], "0.94.0", Path(tempfile.gettempdir()))


if __name__ == "__main__":
    unittest.main()
