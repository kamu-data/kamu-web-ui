/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideToastr } from "ngx-toastr";
import { ReadStepCsv } from "src/app/api/kamu.graphql.interface";
import { getElementByDataTestId } from "src/app/common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

import { mockAddPushSource } from "../../mock.events";
import { AddPushSourceEventComponent } from "./add-push-source-event.component";

describe("AddPushSourceEventComponent", () => {
    let component: AddPushSourceEventComponent;
    let fixture: ComponentFixture<AddPushSourceEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, AddPushSourceEventComponent],
            providers: [provideToastr()],
        }).compileComponents();

        fixture = TestBed.createComponent(AddPushSourceEventComponent);
        component = fixture.componentInstance;
        component.event = Object.assign({}, mockAddPushSource, {
            unsupportedKey: { name: "" },
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check render event data", () => {
        if (mockAddPushSource.sourceName) {
            const sourceName = getElementByDataTestId(fixture, "addPushSource-source-name");
            expect(sourceName.innerText).toEqual(mockAddPushSource.sourceName);
        }

        const schema = getElementByDataTestId(fixture, "addPushSource-readStepCsv-schema");
        expect(schema).toBeDefined();

        const mockSeparator = (mockAddPushSource.read as ReadStepCsv).separator;
        if (mockSeparator) {
            const separator = getElementByDataTestId(fixture, "addPushSource-readStepCsv-separator");
            expect(separator.innerText).toEqual(mockSeparator);
        }

        const header = getElementByDataTestId(fixture, "addPushSource-readStepCsv-header");
        expect(Boolean(header.innerText)).toEqual(true);

        const mergeStrategyType = getElementByDataTestId(fixture, "addPushSource-mergeStrategyLedger-__typename");
        expect(mergeStrategyType.textContent).toEqual("(Ledger strategy)");

        const primaryKey = getElementByDataTestId(fixture, "addPushSource-mergeStrategyLedger-primaryKey-0");
        expect(primaryKey.textContent?.trim()).toEqual("id");
    });

    it("should check render unsupported section", () => {
        const unsupportedSection = getElementByDataTestId(fixture, "unsupported-section");
        expect(unsupportedSection).toBeDefined();
    });
});
