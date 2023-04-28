import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MetadataSchemaUpdate } from "../../dataset.subscriptions.interface";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { mockMetadataSchemaUpdate } from "../data-tabs.mock";
import { MetadataComponent } from "./metadata-component";
import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NavigationService } from "src/app/services/navigation.service";
import { mockDatasetBasicsFragment } from "src/app/search/mock.data";

describe("MetadataComponent", () => {
    let component: MetadataComponent;
    let fixture: ComponentFixture<MetadataComponent>;
    let appDatasetSubsService: AppDatasetSubscriptionsService;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MetadataComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .overrideComponent(MetadataComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(MetadataComponent);
        appDatasetSubsService = TestBed.inject(AppDatasetSubscriptionsService);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check #ngOninit", () => {
        expect(component.currentState).not.toBeDefined();

        appDatasetSubsService.metadataSchemaChanges(
            mockMetadataSchemaUpdate as MetadataSchemaUpdate,
        );
        component.ngOnInit();
        fixture.detectChanges();

        expect(component.currentState).toBeDefined();
    });

    it("should navigate to create SetPollingSource event page", () => {
        const navigateToAddPollingSourceSpy = spyOn(
            navigationService,
            "navigateToAddPollingSource",
        );
        component.navigateToAddPollingSource();
        expect(navigateToAddPollingSourceSpy).toHaveBeenCalledWith({
            accountName: mockDatasetBasicsFragment.owner.name,
            datasetName: mockDatasetBasicsFragment.name as string,
        });
    });

    it("should check select topic", () => {
        const mockName = "testTopicName";
        const selectTopicEmitSpy = spyOn(component.selectTopicEmit, "emit");
        component.selectTopic(mockName);
        expect(selectTopicEmitSpy).toHaveBeenCalledWith(mockName);
    });

    it("should check click on dataset topic", () => {
        const clickDatasetEmitSpy = spyOn(component.clickDatasetEmit, "emit");
        component.onClickDataset(mockDatasetBasicsFragment);
        expect(clickDatasetEmitSpy).toHaveBeenCalledWith(
            mockDatasetBasicsFragment,
        );
    });

    it("should check page change", () => {
        const pageNumber = 1;
        const pageChangeEmitSpy = spyOn(component.pageChangeEmit, "emit");
        component.onPageChange(pageNumber);
        expect(pageChangeEmitSpy).toHaveBeenCalledWith(pageNumber);
    });
});
