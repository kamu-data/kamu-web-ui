/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetListItemComponent } from "./dataset-list-item.component";
import { NgbModule, NgbRatingModule } from "@ng-bootstrap/ng-bootstrap";
import { MatDividerModule } from "@angular/material/divider";
import { mockDatasetListItem } from "src/app/api/mock/dataset.mock";
import { emitClickOnElementByDataTestId, registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { RouterModule } from "@angular/router";
import { NavigationService } from "src/app/services/navigation.service";

describe("DatasetListItemComponent", () => {
    let component: DatasetListItemComponent;
    let fixture: ComponentFixture<DatasetListItemComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatChipsModule,
                NgbRatingModule,
                MatDividerModule,
                MatIconModule,
                NgbModule,
                HttpClientTestingModule,
                SharedTestModule,
                RouterModule,
                DatasetListItemComponent,
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetListItemComponent);
        component = fixture.componentInstance;
        component.row = mockDatasetListItem;
        component.isClickableRow = true;
        component.rowIndex = 0;
        navigationService = TestBed.inject(NavigationService);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check navigate to owner view", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        emitClickOnElementByDataTestId(fixture, "button-popover-verified");
        emitClickOnElementByDataTestId(fixture, "dataset-owner-name");

        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(component.row.owner.accountName);
    });
});
