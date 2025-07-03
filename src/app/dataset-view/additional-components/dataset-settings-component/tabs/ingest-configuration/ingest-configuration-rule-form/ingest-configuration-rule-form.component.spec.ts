/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { IngestConfigurationRuleFormComponent } from "./ingest-configuration-rule-form.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { emitClickOnElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";

describe("IngestConfigurationRuleFormComponent", () => {
    let component: IngestConfigurationRuleFormComponent;
    let fixture: ComponentFixture<IngestConfigurationRuleFormComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                //-----//
                SharedTestModule,
                IngestConfigurationRuleFormComponent,
            ],
        });
        fixture = TestBed.createComponent(IngestConfigurationRuleFormComponent);
        component = fixture.componentInstance;

        component.ingestionRule = { fetchUncacheable: false, __typename: "FlowConfigRuleIngest" };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check emit form", () => {
        const changeConfigurationEmitSpy = spyOn(component.changeConfigurationRuleEmit, "emit");
        emitClickOnElementByDataTestId(fixture, "fetchUncacheable");
        component.ingestConfigurationRuleForm.patchValue({ fetchUncacheable: true });
        expect(changeConfigurationEmitSpy).toHaveBeenCalledTimes(1);
    });
});
