/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { DatasetByIdQuery } from "@api/kamu.graphql.interface";
import { mockDatasetByIdQuery, TEST_DATASET_NAME } from "@api/mock/dataset.mock";

import { BlockIntervalPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/block-interval-property/block-interval-property.component";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { mockDatasetMainDataResponse } from "src/app/search/mock.data";

describe("BlockIntervalPropertyComponent", () => {
    let fixture: ComponentFixture<BlockIntervalPropertyComponent>;
    let requestDatasetInfoByIdSpy: jasmine.Spy;

    const DATASET_ID = "did:odf:fed015c38ec1ae4b02f6f02d78c8ff2752bed730833efb6e9bf431259acdc08f5e27c";
    const OTHER_DATASET_ID = "did:odf:other";
    const OTHER_DATASET_NAME = "alberta.case-details";
    const mockOtherDatasetByIdQuery: DatasetByIdQuery = {
        datasets: { __typename: "Datasets", byId: mockDatasetMainDataResponse.datasets.byOwnerAndName },
    };
    const mockData = {
        prevBlockHash: "f1620a798caf694d544a7ad590fa2230e4c518de1acce010789d0056c61a1fa69d95a",
        newBlockHash: "f162050f7d722779b38215a3770b905842b7214599d80aff1d9479288b5a056a005e2",
        datasetId: DATASET_ID,
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, SharedTestModule, BlockIntervalPropertyComponent],
            providers: [provideToastr(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(BlockIntervalPropertyComponent);
        requestDatasetInfoByIdSpy = spyOn(TestBed.inject(DatasetService), "requestDatasetInfoById").and.returnValue(
            of(mockDatasetByIdQuery),
        );
        fixture.componentRef.setInput("data", mockData);
        fixture.detectChanges();
    });

    function blockLinks(): string[] {
        const host = fixture.nativeElement as HTMLElement;
        const links = host.querySelectorAll<HTMLAnchorElement>('[data-test-id="navigableValue"]');
        return Array.from(links).map((link) => link.getAttribute("href") ?? "");
    }

    it("should link both block hashes to the dataset loaded by its id", () => {
        expect(requestDatasetInfoByIdSpy).toHaveBeenCalledOnceWith(DATASET_ID);
        const links = blockLinks();
        expect(links.length).toEqual(2);
        links.forEach((link) => expect(link).toContain("/" + TEST_DATASET_NAME + "/"));
    });

    it("should not load the dataset again when only the block hashes change", () => {
        fixture.componentRef.setInput("data", { ...mockData, newBlockHash: "f1620other" });
        fixture.detectChanges();

        expect(requestDatasetInfoByIdSpy).toHaveBeenCalledTimes(1);
    });

    it("should link to the new dataset when the dataset id changes", () => {
        requestDatasetInfoByIdSpy.and.returnValue(of(mockOtherDatasetByIdQuery));

        fixture.componentRef.setInput("data", { ...mockData, datasetId: OTHER_DATASET_ID });
        fixture.detectChanges();

        expect(requestDatasetInfoByIdSpy).toHaveBeenCalledWith(OTHER_DATASET_ID);
        blockLinks().forEach((link) => expect(link).toContain("/" + OTHER_DATASET_NAME + "/"));
    });
});
