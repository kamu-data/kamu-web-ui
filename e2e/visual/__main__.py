# Copyright Kamu Data, Inc. and contributors. All rights reserved.
#
# Use of this software is governed by the Business Source License
# included in the LICENSE file.

import sys

from e2e.visual.cli import main

# Worker processes import this module too; only the command runs the CLI
if __name__ == "__main__":
    sys.exit(main())
