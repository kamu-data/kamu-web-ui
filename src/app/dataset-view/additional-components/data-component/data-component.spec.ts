import { mockDatasetBasicsFragment } from "../../../search/mock.data";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { DataComponent } from "./data-component";
import { emitClickOnElementByDataTestId, findElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { mockDataUpdate, mockSqlErrorUpdate } from "../data-tabs.mock";
import { RouterTestingModule } from "@angular/router/testing";
import { Location } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
import { MatDividerModule } from "@angular/material/divider";
import { LoadMoreComponent } from "./load-more/load-more.component";
import { DynamicTableModule } from "../../../components/dynamic-table/dynamic-table.module";

describe("DataComponent", () => {
    let component: DataComponent;
    let fixture: ComponentFixture<DataComponent>;
    let appDatasetSubsService: AppDatasetSubscriptionsService;
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
            ],
            declarations: [DataComponent, LoadMoreComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DataComponent);
        appDatasetSubsService = TestBed.inject(AppDatasetSubscriptionsService);
        location = TestBed.inject(Location);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsFragment;
        spyOn(location, "getState").and.returnValue({ start: 0, end: 100 });
        appDatasetSubsService.changeDatasetData(mockDataUpdate);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check run sql button", fakeAsync(() => {
        const runSQLRequestEmitSpy = spyOn(component.runSQLRequestEmit, "emit");
        tick();
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "runSqlQueryButton");
        expect(runSQLRequestEmitSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check #ngOninit", () => {
        expect(component.currentData).toEqual([]);
        component.ngOnInit();
        expect(component.sqlRequestCode).toEqual(
            `select\n  *\nfrom 'mockName'\nwhere offset>=0 and offset<=100\norder by offset desc`,
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
        appDatasetSubsService.observeSqlErrorOccurred(mockSqlErrorUpdate);
        tick();
        fixture.detectChanges();
        const runSqlButton = findElementByDataTestId(fixture, "runSqlQueryButton") as HTMLButtonElement;
        const elem = findElementByDataTestId(fixture, "sql-error-message");
        expect(runSqlButton.disabled).toBe(false);
        expect(elem.textContent).toEqual(mockSqlErrorUpdate.error);
        flush();
    }));

    it("should calculate sql request params", () => {
        appDatasetSubsService.changeDatasetData(mockDataUpdate);
        fixture.detectChanges();

        const sqlReq = spyOn(component.runSQLRequestEmit, "emit");
        const limit = 1;
        const params = {
            query: component.sqlRequestCode,
            skip: component.currentData.length,
            limit: limit,
        };

        component.loadMore(limit);
        appDatasetSubsService.changeDatasetData(mockDataUpdate);
        expect(sqlReq).toHaveBeenCalledWith(params);

        component.loadMore(limit);
        params.skip = component.currentData.length;

        const secondCallParams = sqlReq.calls.allArgs()[1];
        expect(secondCallParams).toEqual([params]);
    });
});
