/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideToastr } from "ngx-toastr";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { EnvVariablesPropertyComponent } from "./env-variables-property.component";

describe("EnvVariablesPropertyComponent", () => {
    let component: EnvVariablesPropertyComponent;
    let fixture: ComponentFixture<EnvVariablesPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, EnvVariablesPropertyComponent],
            providers: [provideToastr()],
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
