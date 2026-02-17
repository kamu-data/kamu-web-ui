/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { RouterModule } from "@angular/router";

import { NgbModule, NgbRatingModule } from "@ng-bootstrap/ng-bootstrap";
import { mockDatasetListItem } from "src/app/api/mock/dataset.mock";
import { emitClickOnElementByDataTestId, registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { NavigationService } from "src/app/services/navigation.service";

import { DatasetListItemComponent } from "./dataset-list-item.component";

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
                SharedTestModule,
                RouterModule,
                DatasetListItemComponent,
            ],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
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

    it("should check kind of the dataset", () => {
        expect(component.isRoot).toEqual(true);
    });
});
