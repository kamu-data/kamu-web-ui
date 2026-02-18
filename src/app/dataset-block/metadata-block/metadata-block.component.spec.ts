/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSlideToggleHarness } from "@angular/material/slide-toggle/testing";
import { ActivatedRoute } from "@angular/router";

import { of } from "rxjs";

import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";

import { registerMatSvgIcons } from "@common/helpers/base-test.helpers.spec";
import { MetadataBlockFragment } from "@api/kamu.graphql.interface";
import { mockGetMetadataBlockQuery } from "@api/mock/dataset.mock";

import { MetadataBlockComponent } from "src/app/dataset-block/metadata-block/metadata-block.component";

describe("MetadataBlockComponent", () => {
    let component: MetadataBlockComponent;
    let fixture: ComponentFixture<MetadataBlockComponent>;
    let loader: HarnessLoader;

    const blockFragment = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain
        .blockByHash as MetadataBlockFragment;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, MetadataBlockComponent, MatSlideToggleModule],
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
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(MetadataBlockComponent);
        component = fixture.componentInstance;
        loader = TestbedHarnessEnvironment.loader(fixture);
        component.metadata = {
            block: blockFragment,
            blockAsYaml: "test yaml",
            downstreamsCount: 0,
        };
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check emit value for yaml view", async () => {
        const matToggle = await loader.getHarness(
            MatSlideToggleHarness.with({ selector: '[data-test-id="yaml-toggle"]' }),
        );

        const changeToggleSpy = spyOn(component, "toggleYamlView");

        await matToggle.toggle();

        expect(changeToggleSpy).toHaveBeenCalledTimes(1);
    });
});
