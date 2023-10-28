import { mockDatasetBasicsDerivedFragment } from "../../../search/mock.data";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { DataComponent } from "./data.component";

import {
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    getElementByDataTestId,
} from "src/app/common/base-test.helpers.spec";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import {
    mockDataUpdate,
    mockMetadataDerivedUpdate,
    mockOverviewDataUpdate,
    mockSqlErrorUpdate,
} from "../data-tabs.mock";
import { RouterTestingModule } from "@angular/router/testing";
import { Location } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
import { MatDividerModule } from "@angular/material/divider";
import { LoadMoreComponent } from "./load-more/load-more.component";
import { DynamicTableModule } from "../../../components/dynamic-table/dynamic-table.module";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { OverviewUpdate } from "../../dataset.subscriptions.interface";
import _ from "lodash";

describe("DataComponent", () => {
    let component: DataComponent;
    let fixture: ComponentFixture<DataComponent>;
    let datasetSubsService: DatasetSubscriptionsService;
    let location: Location;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                CdkAccordionModule,
                MatIconModule,
                MatMenuModule,
                RouterTestingModule,
                FormsModule,
                MonacoEditorModule.forRoot(),
                MatDividerModule,
                DynamicTableModule,
                MatProgressBarModule,
            ],
            declarations: [DataComponent, LoadMoreComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(DataComponent);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        location = TestBed.inject(Location);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        spyOn(location, "getState").and.returnValue({ start: 0, end: 100 });
        datasetSubsService.emitSqlQueryDataChanged(mockDataUpdate);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check that the progress bar for the editor disappears", fakeAsync(() => {
        fixture.detectChanges();

        expect(component.editorLoaded).toBeFalse();
        const progressBarElementBefore = findElementByDataTestId(fixture, "editor-progress-bar");
        expect(progressBarElementBefore).toBeDefined();

        component.editorLoaded = true;
        tick();
        fixture.detectChanges();

        const progressBarElementAfter = findElementByDataTestId(fixture, "editor-progress-bar");
        expect(progressBarElementAfter).toBeUndefined();
        flush();
    }));

    it("should check run sql button", fakeAsync(() => {
        const runSQLRequestEmitSpy = spyOn(component.runSQLRequestEmit, "emit");
        tick();
        fixture.detectChanges();
        runSQLRequestEmitSpy.calls.reset();

        emitClickOnElementByDataTestId(fixture, "runSqlQueryButton");

        expect(runSQLRequestEmitSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check #ngOninit", () => {
        expect(component.currentData).toEqual([]);
        component.ngOnInit();
        expect(component.sqlRequestCode).toEqual(
            `select\n  *\nfrom '${mockDatasetBasicsDerivedFragment.alias}'\nwhere offset>=0 and offset<=100\norder by offset desc`,
        );
    });

    it("should check successful query result update", fakeAsync(() => {
        tick();
        fixture.detectChanges();
        expect(component.currentData).toEqual(mockDataUpdate.content);
        flush();
    }));

    it("should check invalid SQL result update", fakeAsync(() => {
        tick();
        fixture.detectChanges();
        datasetSubsService.emitSqlErrorOccurred(mockSqlErrorUpdate);
        tick();
        fixture.detectChanges();
        const runSqlButton = findElementByDataTestId(fixture, "runSqlQueryButton") as HTMLButtonElement;
        const elem = getElementByDataTestId(fixture, "sql-error-message");
        expect(runSqlButton.disabled).toBe(false);
        expect(elem.textContent).toEqual(mockSqlErrorUpdate.error);
        flush();
    }));

    it("should calculate sql request params", () => {
        datasetSubsService.emitSqlQueryDataChanged(mockDataUpdate);
        fixture.detectChanges();

        const sqlReq = spyOn(component.runSQLRequestEmit, "emit");
        const limit = 1;
        const params = {
            query: component.sqlRequestCode,
            skip: component.currentData.length,
            limit: limit,
        };

        component.loadMore(limit);
        datasetSubsService.emitSqlQueryDataChanged(mockDataUpdate);
        expect(sqlReq).toHaveBeenCalledWith(params);

        component.loadMore(limit);
        params.skip = component.currentData.length;

        const secondCallParams = sqlReq.calls.allArgs()[1];
        expect(secondCallParams).toEqual([params]);
    });

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
});
