import { mockDatasetBasicsFragment } from "./../../../search/mock.data";
import { mockOverviewDataUpdate } from "./../data-tabs.mock";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { OverviewComponent } from "./overview-component";
import { OverviewDataUpdate } from "../../dataset.subscriptions.interface";
import { DatasetKind } from "src/app/api/kamu.graphql.interface";
import { NavigationService } from "src/app/services/navigation.service";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe("OverviewComponent", () => {
    let component: OverviewComponent;
    let fixture: ComponentFixture<OverviewComponent>;
    let appDatasetSubsService: AppDatasetSubscriptionsService;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OverviewComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(OverviewComponent);
        appDatasetSubsService = TestBed.inject(AppDatasetSubscriptionsService);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsFragment;
        fixture.detectChanges();
    });

    it("should create", async () => {
        await expect(component).toBeTruthy();
    });

    it("should check #ngOninit", async () => {
        await expect(component.currentState).not.toBeDefined();
        appDatasetSubsService.changeDatasetOverviewData(
            mockOverviewDataUpdate as OverviewDataUpdate,
        );
        component.ngOnInit();
        await expect(component.metadataFragmentBlock).toBeDefined();
        await expect(component.currentState).toBeDefined();
    });

    it("should check metadataFragmentBlock equal undefined", async () => {
        await expect(component.currentState).not.toBeDefined();
        component.ngOnInit();
        await expect(component.metadataFragmentBlock).toEqual(undefined);
    });

    it("should check toggle readme view", async () => {
        const toggleReadmeViewEmitSpy = spyOn(
            component.toggleReadmeViewEmit,
            "emit",
        );
        component.toggleReadmeView();
        await expect(toggleReadmeViewEmitSpy).toHaveBeenCalled();
    });

    [
        { kind: DatasetKind.Derivative, result: "Derivative" },
        { kind: DatasetKind.Root, result: "Root" },
    ].forEach((item: { kind: DatasetKind; result: string }) => {
        it(`should return dataset kind ${item.kind} to string ${item.result}`, async () => {
            const result = component.datasetKind(item.kind);
            await expect(result).toBe(item.result);
        });
    });

    it("should check open website", async () => {
        const navigationServiceSpy = spyOn(
            navigationService,
            "navigateToWebsite",
        );
        component.showWebsite("http://google.com");
        await expect(navigationServiceSpy).toHaveBeenCalled();
    });

    it("should check show dataSize", async () => {
        const result = component.dataSize(1024);
        await expect(result).toBe("1.0 KiB");
    });

    it("should select topic name", () => {
        const topicName = "test topic name";
        const selectTopicEmitSpy = spyOn(component.selectTopicEmit, "emit");
        component.selectTopic(topicName);
        expect(selectTopicEmitSpy).toHaveBeenCalledWith(topicName);
    });
});
