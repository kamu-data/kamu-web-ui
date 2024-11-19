import { mockDatasetBasicsDerivedFragment, mockDatasetBasicsRootFragment } from "../../../search/mock.data";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { DataComponent } from "./data.component";

import { emitClickOnElementByDataTestId, findElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { mockMetadataDerivedUpdate, mockOverviewDataUpdate, mockOverviewDataUpdateNullable } from "../data-tabs.mock";
import { RouterTestingModule } from "@angular/router/testing";
import { Location } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { LoadMoreComponent } from "../../../query/shared/load-more/load-more.component";
import { DynamicTableModule } from "../../../components/dynamic-table/dynamic-table.module";
import { EditorModule } from "src/app/shared/editor/editor.module";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";
import _ from "lodash";
import { RequestTimerComponent } from "../../../query/shared/request-timer/request-timer.component";
import { SqlEditorComponent } from "src/app/shared/editor/components/sql-editor/sql-editor.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";
import { SavedQueriesSectionComponent } from "../../../query/shared/saved-queries-section/saved-queries-section.component";
import { QueryAndResultSectionsComponent } from "../../../query/shared/query-and-result-sections/query-and-result-sections.component";

describe("DataComponent", () => {
    let component: DataComponent;
    let fixture: ComponentFixture<DataComponent>;
    let datasetSubsService: DatasetSubscriptionsService;
    let location: Location;
    let ngbModalService: NgbModal;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo],
            imports: [
                CdkAccordionModule,
                MatIconModule,
                MatMenuModule,
                RouterTestingModule,
                FormsModule,
                MatDividerModule,
                DynamicTableModule,
                EditorModule,
                MatProgressBarModule,
                CdkAccordionModule,
                HttpClientModule,
                ToastrModule.forRoot(),
            ],
            declarations: [
                DataComponent,
                SavedQueriesSectionComponent,
                QueryAndResultSectionsComponent,
                LoadMoreComponent,
                RequestTimerComponent,
                SqlEditorComponent,
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(DataComponent);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        location = TestBed.inject(Location);
        ngbModalService = TestBed.inject(NgbModal);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        component.sqlLoading = false;
        component.sqlRequestCode = "";
        spyOn(location, "getState").and.returnValue({ start: 0, end: 100 });
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check run sql button", fakeAsync(() => {
        const runSQLRequestEmitSpy = spyOn(component.runSQLRequestEmit, "emit");
        tick();
        fixture.detectChanges();
        runSQLRequestEmitSpy.calls.reset();

        emitClickOnElementByDataTestId(fixture, "runSqlQueryButton");

        expect(runSQLRequestEmitSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check schema column names", fakeAsync(() => {
        datasetSubsService.emitOverviewChanged({
            schema: mockMetadataDerivedUpdate.schema,
            content: mockOverviewDataUpdate.content,
            overview: _.cloneDeep(mockOverviewDataUpdate.overview),
            size: mockOverviewDataUpdate.size,
        } as OverviewUpdate);
        tick();
        fixture.detectChanges();
        const columnSchemaNames = mockMetadataDerivedUpdate.schema?.fields.map((item) => item.name);
        columnSchemaNames?.forEach((columnName) => {
            expect(findElementByDataTestId(fixture, `column-name-${columnName}`)?.textContent?.trim()).toEqual(
                columnName,
            );
        });
        flush();
    }));

    it("should check add data", () => {
        const ngbModalServiceSpy = spyOn(ngbModalService, "open").and.callThrough();
        component.datasetBasics = mockDatasetBasicsRootFragment;

        component.addData({
            schema: mockMetadataDerivedUpdate.schema,
            content: mockOverviewDataUpdate.content,
            overview: _.cloneDeep(mockOverviewDataUpdateNullable.overview),
            size: mockOverviewDataUpdate.size,
        } as OverviewUpdate);
        expect(ngbModalServiceSpy).toHaveBeenCalledTimes(1);
    });
});
