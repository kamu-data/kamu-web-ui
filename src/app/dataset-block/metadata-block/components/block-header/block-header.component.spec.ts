import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MetadataBlockFragment } from "./../../../../api/kamu.graphql.interface";
import { NavigationService } from "src/app/services/navigation.service";
import { mockDatasetInfo } from "./../../../../search/mock.data";
import {
    mockGetMetadataBlockQuery,
    TEST_BLOCK_HASH,
} from "./../../../../api/mock/dataset.mock";
import { DatasetApi } from "src/app/api/dataset.api";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BlockHeaderComponent } from "./block-header.component";
import { Apollo } from "apollo-angular";
import { of } from "rxjs";
import { MatMenuModule } from "@angular/material/menu";

describe("BlockHeaderComponent", () => {
    let component: BlockHeaderComponent;
    let fixture: ComponentFixture<BlockHeaderComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BlockHeaderComponent],
            imports: [MatMenuModule, MatIconModule, MatDividerModule],
            providers: [Apollo, DatasetApi],
        }).compileComponents();

        fixture = TestBed.createComponent(BlockHeaderComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check navigate to metadata block page", () => {
        component.blockHash = TEST_BLOCK_HASH;
        component.datasetInfo = mockDatasetInfo;
        component.block$ = of(
            mockGetMetadataBlockQuery.datasets as MetadataBlockFragment,
        );
        fixture.detectChanges();

        const navigateToMetadataBlockSpy = spyOn(
            navigationService,
            "navigateToMetadataBlock",
        );
        component.navigateToMetadataBlock(
            mockDatasetInfo.accountName,
            mockDatasetInfo.datasetName,
            TEST_BLOCK_HASH,
        );
        expect(navigateToMetadataBlockSpy).toHaveBeenCalledWith({
            datasetName: mockDatasetInfo.datasetName,
            accountName: mockDatasetInfo.accountName,
            blockHash: TEST_BLOCK_HASH,
        });
    });
});
