import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MetadataSchemaUpdate } from "../../dataset.subscriptions.interface";
import { AppDatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { mockMetadataSchemaUpdate } from "../data-tabs.mock";
import { MetadataComponent } from "./metadata-component";
import { ChangeDetectionStrategy } from "@angular/core";
import { mockDatasetBasicsFragment } from "src/app/search/mock.data";
import { BlockRowDataComponent } from "src/app/dataset-block/metadata-block/components/block-row-data/block-row-data.component";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";
import { MetadataBlockModule } from "src/app/dataset-block/metadata-block/metadata-block.module";
import { HIGHLIGHT_OPTIONS } from "ngx-highlightjs";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("MetadataComponent", () => {
    let component: MetadataComponent;
    let fixture: ComponentFixture<MetadataComponent>;
    let appDatasetSubsService: AppDatasetSubscriptionsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                MetadataComponent,
                BlockRowDataComponent,
                TooltipIconComponent,
            ],
            imports: [
                NgbTooltipModule,
                MatIconModule,
                MetadataBlockModule,
                SharedTestModule,
            ],
            providers: [
                {
                    provide: HIGHLIGHT_OPTIONS,
                    useValue: {
                        coreLibraryLoader: () =>
                            import("highlight.js/lib/core"),
                        languages: {
                            sql: () => import("highlight.js/lib/languages/sql"),
                            yaml: () =>
                                import("highlight.js/lib/languages/yaml"),
                        },
                    },
                },
            ],
        })
            .overrideComponent(MetadataComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(MetadataComponent);
        appDatasetSubsService = TestBed.inject(AppDatasetSubscriptionsService);
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
