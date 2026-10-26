/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { requireValue } from "@common/helpers/app.helpers";
import { registerMatSvgIcons, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockGetMetadataBlockQuery } from "@api/mock/dataset.mock";

import { BlockHeaderComponent } from "src/app/dataset-block/metadata-block/components/block-header/block-header.component";

describe("BlockHeaderComponent", () => {
    let component: BlockHeaderComponent;
    let fixture: ComponentFixture<BlockHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, BlockHeaderComponent],
            providers: [Apollo, provideToastr(), provideHttpClient(), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(BlockHeaderComponent);
        component = fixture.componentInstance;
        setComponentInput(
            fixture,
            "block",
            requireValue(mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain.blockByHash ?? null),
        );
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
