/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";
import { ResolveFn } from "@angular/router";
import { datasetSettingsActiveSectionResolver } from "./dataset-settings-active-section.resolver";
import { SettingsTabsEnum } from "src/app/dataset-view/additional-components/dataset-settings-component/dataset-settings.model";

describe("datasetSettingsActiveSectionResolver", () => {
    const executeResolver: ResolveFn<SettingsTabsEnum> = (...resolverParameters) =>
        TestBed.runInInjectionContext(() => datasetSettingsActiveSectionResolver(...resolverParameters));

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it("should be created", () => {
        expect(executeResolver).toBeTruthy();
    });
});
