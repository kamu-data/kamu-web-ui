import { BlockService } from "./../../block.service";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { YamlViewSectionComponent } from "./yaml-view-section.component";
import { mockGetMetadataBlockQuery } from "src/app/api/mock/dataset.mock";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";

describe("YamlViewSectionComponent", () => {
    let component: YamlViewSectionComponent;
    let fixture: ComponentFixture<YamlViewSectionComponent>;
    let blockService: BlockService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [YamlViewSectionComponent],
            imports: [ApolloTestingModule],
        }).compileComponents();

        fixture = TestBed.createComponent(YamlViewSectionComponent);
        blockService = TestBed.inject(BlockService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check onMetadataBlockChanges subscribe", () => {
        const mockBlock = mockGetMetadataBlockQuery.datasets.byOwnerAndName
            ?.metadata.chain.blockByHash as MetadataBlockFragment;
        blockService.metadataBlockChanges(mockBlock);
        component.ngOnInit();
        fixture.detectChanges();
        expect(component.block).toEqual(mockBlock);
    });

    it("should check onMetadataBlockAsYamlChanges subscribe", () => {
        const mockBlock = mockGetMetadataBlockQuery.datasets.byOwnerAndName
            ?.metadata.chain.blockByHashEncoded as string | undefined;
        if (mockBlock) {
            blockService.metadataBlockAsYamlChanges(mockBlock);
            component.ngOnInit();
            fixture.detectChanges();
            expect(component.yamlEventText).toEqual(mockBlock);
        }
    });
});
