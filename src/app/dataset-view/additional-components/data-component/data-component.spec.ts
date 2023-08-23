import { mockDatasetBasicsFragment } from "./../../../search/mock.data";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { DataComponent } from "./data-component";
import { emitClickOnElementByDataTestId, findElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { mockDataUpdate, mockSqlErrorUpdate } from "../data-tabs.mock";
import { first } from "rxjs/operators";
import { RouterTestingModule } from "@angular/router/testing";
import { Location } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { MonacoEditorModule } from "ngx-monaco-editor-v2";
import { MatDividerModule } from "@angular/material/divider";

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
            ],
            declarations: [DataComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DataComponent);
        appDatasetSubsService = TestBed.inject(AppDatasetSubscriptionsService);
        location = TestBed.inject(Location);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsFragment;
        spyOn(location, "getState").and.returnValue({ start: 0, end: 100 });
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check run sql button", () => {
        const emitterSubscription$ = component.runSQLRequestEmit
            .pipe(first())
            .subscribe((query: string) => expect(query).toEqual(component.sqlRequestCode));

        emitClickOnElementByDataTestId(fixture, "runSqlQueryButton");
        fixture.detectChanges();
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should check #ngOninit", () => {
        expect(component.currentData).toEqual([]);
        expect(component.currentSchema).toEqual(null);
        expect(component.sqlErrorMarker).toBe(null);
        component.ngOnInit();
        expect(component.sqlRequestCode).toEqual(
            `select\n  *\nfrom 'mockName'\nwhere offset>=0 and offset<=100\norder by offset desc`,
        );
    });

    it("should check successful query result update", () => {
        fixture.detectChanges();
        appDatasetSubsService.changeDatasetData(mockDataUpdate);

        expect(component.currentData).toEqual(mockDataUpdate.content);
        expect(component.currentSchema).toEqual(mockDataUpdate.schema);
        expect(component.sqlErrorMarker).toBe(null);
    });

    it("should check invalid SQL result update", () => {
        const runSqlButton = findElementByDataTestId(fixture, "runSqlQueryButton") as HTMLButtonElement;
        appDatasetSubsService.observeSqlErrorOccurred(mockSqlErrorUpdate);
        fixture.detectChanges();
        expect(component.currentData).toEqual([]);
        expect(component.currentSchema).toEqual(null);
        expect(component.sqlErrorMarker).toBe(mockSqlErrorUpdate.error);
        expect(runSqlButton.disabled).toBe(false);
    });
});
