/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { EngineSelectComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/components/engine-select/engine-select.component";
import { Engine } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine-section.types";
import { mockEngines } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";

import { emitClickOnElementByDataTestId } from "@common/helpers/base-test.helpers.spec";

describe("EngineSelectComponent", () => {
    let component: EngineSelectComponent;
    let fixture: ComponentFixture<EngineSelectComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EngineSelectComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(EngineSelectComponent);
        component = fixture.componentInstance;
        component.data = mockEngines.data.knownEngines;
        component.engine = Engine.Spark;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check open dropdown", () => {
        expect(component.showDropdown).toEqual(false);
        emitClickOnElementByDataTestId(fixture, "input-dropdown");
        expect(component.showDropdown).toEqual(true);
    });

    it("should check close dropdown when click dropdown outside", () => {
        expect(component.showDropdown).toEqual(false);
        emitClickOnElementByDataTestId(fixture, "input-dropdown");
        expect(component.showDropdown).toEqual(true);
        document.dispatchEvent(new MouseEvent("click"));
        expect(component.showDropdown).toEqual(false);
    });
});
