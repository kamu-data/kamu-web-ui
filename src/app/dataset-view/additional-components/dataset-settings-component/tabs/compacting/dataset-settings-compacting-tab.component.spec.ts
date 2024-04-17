import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { DatasetSettingsCompactingTabComponent } from "./dataset-settings-compacting-tab.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import {
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    setFieldValue,
} from "src/app/common/base-test.helpers.spec";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { ModalService } from "src/app/components/modal/modal.service";
import { DatasetCompactingService } from "../../services/dataset-compacting.service";
import { of } from "rxjs";
import { NavigationService } from "src/app/services/navigation.service";
import AppValues from "src/app/common/app.values";

describe("DatasetSettingsCompactingTabComponent", () => {
    let component: DatasetSettingsCompactingTabComponent;
    let fixture: ComponentFixture<DatasetSettingsCompactingTabComponent>;
    let modalService: ModalService;
    let datasetCompactingService: DatasetCompactingService;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetSettingsCompactingTabComponent, TooltipIconComponent],
            providers: [Apollo],
            imports: [
                ApolloTestingModule,
                MatDividerModule,
                ReactiveFormsModule,
                ToastrModule.forRoot(),
                BrowserAnimationsModule,
                MatIconModule,
                NgbTooltipModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetSettingsCompactingTabComponent);
        component = fixture.componentInstance;
        modalService = TestBed.inject(ModalService);
        datasetCompactingService = TestBed.inject(DatasetCompactingService);
        navigationService = TestBed.inject(NavigationService);
        component.datasetBasics = mockDatasetBasicsRootFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check display error messages", () => {
        setFieldValue(fixture, "slice-size", "-5");
        fixture.detectChanges();
        const errorSliceSizeMessage = findElementByDataTestId(fixture, "slice-size-error");
        expect(errorSliceSizeMessage?.textContent?.trim()).toEqual(component.MIN_VALUE_ERROR_TEXT);

        setFieldValue(fixture, "records-count", "0");
        fixture.detectChanges();
        const errorRecordsCountMessage = findElementByDataTestId(fixture, "records-count-error");
        expect(errorRecordsCountMessage?.textContent?.trim()).toEqual(component.MIN_VALUE_ERROR_TEXT);
    });

    it("should check run hard compaction", fakeAsync(() => {
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        const runHardCompactionSpy = spyOn(datasetCompactingService, "runHardCompaction").and.returnValue(of(true));
        const modalServiceSpy = spyOn(modalService, "error").and.callFake((options) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
        emitClickOnElementByDataTestId(fixture, "run-compaction-btn");

        expect(modalServiceSpy).toHaveBeenCalledTimes(1);
        expect(runHardCompactionSpy).toHaveBeenCalledTimes(1);
        tick(AppValues.SIMULATION_START_CONDITION_DELAY_MS);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledTimes(1);
        flush();
    }));
});
