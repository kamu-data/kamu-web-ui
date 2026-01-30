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
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { mockGetMetadataBlockQuery } from "src/app/api/mock/dataset.mock";
import { provideToastr } from "ngx-toastr";
import { HarnessLoader } from "@angular/cdk/testing";
import { MatSlideToggleHarness } from "@angular/material/slide-toggle/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

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

    it("should check emit value for yaml view", async () => {
        const matToggle = await loader.getHarness(
            MatSlideToggleHarness.with({ selector: '[data-test-id="yaml-toggle"]' }),
        );

        const changeToggleSpy = spyOn(component, "toggleYamlView");

        await matToggle.toggle();

        expect(changeToggleSpy).toHaveBeenCalledTimes(1);
    });
});
