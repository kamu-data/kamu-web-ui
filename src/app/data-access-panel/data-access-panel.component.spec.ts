/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "@common/modules/shared-test.module";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { DataAccessPanelComponent } from "src/app/data-access-panel/data-access-panel.component";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";

describe("DataAccessPanelComponent", () => {
    let component: DataAccessPanelComponent;
    let fixture: ComponentFixture<DataAccessPanelComponent>;
    let ngbModalService: NgbModal;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [SharedTestModule, DataAccessPanelComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DataAccessPanelComponent);
        ngbModalService = TestBed.inject(NgbModal);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check open modal window", () => {
        const ngbModalOpenSpy = spyOn(ngbModalService, "open").and.callThrough();
        component.openDataAccessModal();
        expect(ngbModalOpenSpy).toHaveBeenCalledTimes(1);
    });
});
