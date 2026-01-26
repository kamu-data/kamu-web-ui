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
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ToastrModule } from "ngx-toastr";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

describe("BlockHeaderComponent", () => {
    let component: BlockHeaderComponent;
    let fixture: ComponentFixture<BlockHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
    imports: [SharedTestModule, BlockHeaderComponent, ToastrModule.forRoot()],
    providers: [Apollo, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(BlockHeaderComponent);
        component = fixture.componentInstance;
        component.block = mockGetMetadataBlockQuery.datasets.byOwnerAndName?.metadata.chain
            .blockByHash as MetadataBlockFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
