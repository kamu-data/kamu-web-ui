import { mockDatasetBasicsFragment } from "./../../../search/mock.data";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { DataComponent } from "./data-component";
import { emitClickOnElement } from "src/app/common/base-test.helpers.spec";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { mockDataUpdate } from "../data-tabs.mock";
import { first } from "rxjs/operators";

describe("DataComponent", () => {
    let component: DataComponent;
    let fixture: ComponentFixture<DataComponent>;
    let appDatasetSubsService: AppDatasetSubscriptionsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CdkAccordionModule, MatIconModule, MatMenuModule],
            declarations: [DataComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(DataComponent);
        appDatasetSubsService = TestBed.inject(AppDatasetSubscriptionsService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check run sql button", () => {
        const emitterSubscription$ = component.runSQLRequestEmit
            .pipe(first())
            .subscribe((query: string) =>
                expect(query).toEqual(component.sqlRequestCode),
            );

        emitClickOnElement(fixture, '[data-test-id="runSqlQueryButton"]');
        fixture.detectChanges();
        expect(emitterSubscription$.closed).toBeTrue();
    });

    it("should check #ngOninit", () => {
        component.datasetBasics = mockDatasetBasicsFragment;
        expect(component.currentData).toEqual([]);
        expect(component.currentSchema).toEqual(DataComponent.DefaultDatasetSchema);
        expect(component.sqlErrorMarker).toBe(null);

        appDatasetSubsService.changeDatasetData(mockDataUpdate);
        component.ngOnInit();

        expect(component.currentData).toBeDefined();
        expect(component.currentSchema).toBeDefined();
        expect(component.sqlRequestCode).toEqual(
            `select\n  *\nfrom 'mockName'`,
        );
    });
});
