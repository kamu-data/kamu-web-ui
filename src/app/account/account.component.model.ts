/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AccountTabs } from "./account.constants";

export interface AccountPageQueryParams {
    tab?: AccountTabs;
    page?: number;
}
