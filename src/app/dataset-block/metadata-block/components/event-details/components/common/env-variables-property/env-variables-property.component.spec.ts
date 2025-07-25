/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { EnvVariablesPropertyComponent } from "./env-variables-property.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("EnvVariablesPropertyComponent", () => {
    let component: EnvVariablesPropertyComponent;
    let fixture: ComponentFixture<EnvVariablesPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, EnvVariablesPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EnvVariablesPropertyComponent);
        component = fixture.componentInstance;
        component.data = [
            { name: "testName1", value: null },
            { name: "testName2", value: "testValue" },
        ];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
