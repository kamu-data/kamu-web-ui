import { NavigationService } from "./../../services/navigation.service";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatChipsModule } from "@angular/material/chips";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { DatasetListItemComponent } from "./dataset-list-item.component";
import { NgbModule, NgbRatingModule } from "@ng-bootstrap/ng-bootstrap";
import { MatDividerModule } from "@angular/material/divider";
import { mockDatasetListItem } from "src/app/api/mock/dataset.mock";
import { emitClickOnElement } from "src/app/common/base-test.helpers.spec";

describe("DatasetListItemComponent", () => {
    let component: DatasetListItemComponent;
    let fixture: ComponentFixture<DatasetListItemComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetListItemComponent],
            imports: [
                MatChipsModule,
                NgbRatingModule,
                MatDividerModule,
                MatIconModule,
                NgbModule,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

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
        const navigateToOwnerViewSpy = spyOn(
            navigationService,
            "navigateToOwnerView",
        );
        emitClickOnElement(fixture, '[data-test-id="button-popover-verified"]');
        emitClickOnElement(fixture, '[data-test-id="dataset-owner-name"]');

        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(
            component.row.owner.name,
        );
    });

    it("should check click on dataset name", () => {
        const selectDatasetEmitSpy = spyOn(component.selectDatasetEmit, "emit");
        emitClickOnElement(fixture, '[data-test-id="dataset-name-button-0"]');
        expect(selectDatasetEmitSpy).toHaveBeenCalledWith(mockDatasetListItem);
    });
});
