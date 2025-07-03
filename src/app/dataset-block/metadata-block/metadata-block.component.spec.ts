/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { ApolloTestingModule } from "apollo-angular/testing";
import { of } from "rxjs";
import { MetadataBlockComponent } from "./metadata-block.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { mockGetMetadataBlockQuery } from "src/app/api/mock/dataset.mock";
import { provideToastr } from "ngx-toastr";

describe("MetadataBlockComponent", () => {
    let component: MetadataBlockComponent;
    let fixture: ComponentFixture<MetadataBlockComponent>;

    const blockFragment = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain
        .blockByHash as MetadataBlockFragment;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, HttpClientTestingModule, MetadataBlockComponent],
            providers: [
                provideToastr(),
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: of({
                            accountName: "accountName",
                            datasetName: "datasetName",
                            blockHash: "ewrwe213123",
                        }),
                        snapshot: {
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return "accountName";
                                        case "datasetName":
                                            return "datasetName";
                                    }
                                },
                            },
                        },
                    },
                },
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(MetadataBlockComponent);
        component = fixture.componentInstance;
        (component.metadata = {
            block: blockFragment,
            blockAsYaml: "test yaml",
            downstreamsCount: 0,
        }),
            fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
