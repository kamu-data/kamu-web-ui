import { SetPollingSourceEventComponent } from "./components/set-polling-source-event/set-polling-source-event.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { BlockService } from "./../../block.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { DatasetApi } from "src/app/api/dataset.api";
import { EventDetailsComponent } from "./event-details.component";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { mockGetMetadataBlockQuery } from "src/app/api/mock/dataset.mock";
import { AddDataEventFragment } from "./../../../../api/kamu.graphql.interface";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("EventDetailsComponent", () => {
    let component: EventDetailsComponent;
    let fixture: ComponentFixture<EventDetailsComponent>;
    let blockService: BlockService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EventDetailsComponent, SetPollingSourceEventComponent],
            imports: [SharedTestModule],
            providers: [Apollo, DatasetApi],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(EventDetailsComponent);
        blockService = TestBed.inject(BlockService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check #OnInit", () => {
        const blockFragment = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain
            .blockByHash as MetadataBlockFragment;
        blockService.metadataBlockChanges(blockFragment);
        spyOnProperty(component, "addDataEvent", "get").and.returnValue(blockFragment.event as AddDataEventFragment);

        component.ngOnInit();

        expect(component.block).toEqual(blockFragment);
        expect(component.addDataEvent).toBe(blockFragment.event as AddDataEventFragment);
    });

    it("should check onMetadataBlockChanges subscribe", () => {
        const mockBlock = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain
            .blockByHash as MetadataBlockFragment;
        blockService.metadataBlockChanges(mockBlock);
        component.ngOnInit();
        expect(component.block).toEqual(mockBlock);
    });
});
