/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { RedirectCommand, ResolveFn } from "@angular/router";

import { map } from "rxjs";

import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";

import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";
import { resolveSettingsTabAccess } from "src/app/dataset-view/additional-components/dataset-settings-component/resolvers/settings-tab-access.helpers";

export const addWebhookResolverFn: ResolveFn<DatasetBasicsFragment> = () => {
    return resolveSettingsTabAccess(SettingsTabsEnum.WEBHOOKS).pipe(
        map((data) => (data instanceof RedirectCommand ? data : data.datasetBasics)),
    );
};
