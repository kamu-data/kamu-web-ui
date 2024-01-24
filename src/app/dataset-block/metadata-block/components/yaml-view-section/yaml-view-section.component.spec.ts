import { BlockService } from "../../block.service";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { YamlViewSectionComponent } from "./yaml-view-section.component";
import { ChangeDetectionStrategy, NO_ERRORS_SCHEMA } from "@angular/core";
import { findElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { metadataBlockSetVocab } from "src/app/common/data.helpers.spec";
import { YamlEventViewerComponent } from "../event-details/components/common/yaml-event-viewer/yaml-event-viewer.component";

describe("YamlViewSectionComponent", () => {
    let component: YamlViewSectionComponent;
    let fixture: ComponentFixture<YamlViewSectionComponent>;
    let blockService: BlockService;
    const mockAddPushSourceYaml =
        "kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2023-12-28T09:41:56.469218218Z\n  prevBlockHash: zW1jaUXuf1HLoKvdQhYNq1e3x6KCFrY7UCqXsgVMfJBJF77\n  sequenceNumber: 1\n  event:\n    kind: addPushSource\n    sourceName: mockSource\n    read:\n      kind: csv\n      schema:\n      - id INT\n      separator: ','\n      encoding: utf8\n      quote: '\"'\n      escape: \\\n      enforceSchema: true\n      nanValue: NaN\n      positiveInf: Inf\n      negativeInf: -Inf\n      dateFormat: rfc3339\n      timestampFormat: rfc3339\n    merge:\n      kind: append\n";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [YamlViewSectionComponent, YamlEventViewerComponent],
            imports: [ApolloTestingModule],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(YamlViewSectionComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })

            .compileComponents();

        fixture = TestBed.createComponent(YamlViewSectionComponent);
        blockService = TestBed.inject(BlockService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check yaml event viewer  visible ", fakeAsync(() => {
        blockService.currentBlock = metadataBlockSetVocab;
        blockService.emitMetadataBlockAsYamlChanged(mockAddPushSourceYaml);
        fixture.detectChanges();
        tick();
        const eventViewer = findElementByDataTestId(fixture, "yaml-event-viewer");
        expect(eventViewer).toBeDefined();
        flush();
    }));
});
