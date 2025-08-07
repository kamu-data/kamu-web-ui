/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BlockHeaderComponent } from "./block-header.component";
import { Apollo } from "apollo-angular";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { mockGetMetadataBlockQuery } from "src/app/api/mock/dataset.mock";
import { MetadataBlockFragment } from "src/app/api/kamu.graphql.interface";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ToastrModule } from "ngx-toastr";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSlideToggleHarness } from "@angular/material/slide-toggle/testing";
import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";

describe("BlockHeaderComponent", () => {
    let component: BlockHeaderComponent;
    let fixture: ComponentFixture<BlockHeaderComponent>;
    let loader: HarnessLoader;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                SharedTestModule,
                BlockHeaderComponent,
                MatSlideToggleModule,
                ToastrModule.forRoot(),
                HttpClientTestingModule,
            ],
            providers: [Apollo],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(BlockHeaderComponent);
        loader = TestbedHarnessEnvironment.loader(fixture);
        component = fixture.componentInstance;
        component.block = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain
            .blockByHash as MetadataBlockFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check emit value for yaml view", async () => {
        const matToggle = await loader.getHarness(
            MatSlideToggleHarness.with({ selector: '[data-test-id="yaml-toggle"]' }),
        );

        const changeToggleSpy = spyOn(component, "changeToggle");

        await matToggle.toggle();

        expect(changeToggleSpy).toHaveBeenCalledTimes(1);
    });
});
