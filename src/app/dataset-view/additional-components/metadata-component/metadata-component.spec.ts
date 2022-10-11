import { mockDatasetBasicsFragment } from "./../../../search/mock.data";
import { emitClickOnElement } from "src/app/common/base-test.helpers.spec";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MetadataSchemaUpdate } from "../../dataset.subscriptions.interface";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { mockMetadataSchemaUpdate } from "../data-tabs.mock";
import { MetadataComponent } from "./metadata-component";
import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetMetadataSummaryFragment } from "src/app/api/kamu.graphql.interface";

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
        fixture.detectChanges();
    });

    it("should create", async () => {
        await expect(component).toBeTruthy();
    });

    it("should check #ngOninit", async () => {
        await expect(component.currentState).not.toBeDefined();
        appDatasetSubsService.metadataSchemaChanges(
            mockMetadataSchemaUpdate as MetadataSchemaUpdate,
        );
        component.ngOnInit();
        fixture.detectChanges();
        await expect(component.currentState).toBeDefined();
    });

    it("should check navigate to website", async () => {
        component.currentState = {
            schema: mockMetadataSchemaUpdate.schema,
            metadata:
                mockMetadataSchemaUpdate.metadata as DatasetMetadataSummaryFragment,
            pageInfo: mockMetadataSchemaUpdate.pageInfo,
        };
        fixture.detectChanges();
        const navigateToWebsiteSpy = spyOn(
            navigationService,
            "navigateToWebsite",
        );
        emitClickOnElement(fixture, '[data-test-id="navigateToWebsite"]');
        await expect(navigateToWebsiteSpy).toHaveBeenCalled();
    });

    it("should check onClickDataset method", async () => {
        const clickDatasetEmitSpy = spyOn(component.clickDatasetEmit, "emit");
        component.onClickDataset(mockDatasetBasicsFragment);
        await expect(clickDatasetEmitSpy).toHaveBeenCalled();
    });
});
