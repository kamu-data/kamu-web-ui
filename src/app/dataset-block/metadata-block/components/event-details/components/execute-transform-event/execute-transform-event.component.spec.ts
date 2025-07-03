/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ExecuteTransform } from "../../../../../../api/kamu.graphql.interface";
import { mockExecuteTransform } from "../../mock.events";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ExecuteTransformEventComponent } from "./execute-transform-event.component";
import { SizePropertyComponent } from "../common/size-property/size-property.component";
import { OffsetIntervalPropertyComponent } from "../common/offset-interval-property/offset-interval-property.component";
import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";
import { provideToastr } from "ngx-toastr";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("ExecuteTransformEventComponent", () => {
    let component: ExecuteTransformEventComponent;
    let fixture: ComponentFixture<ExecuteTransformEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [provideAnimations(), provideToastr()],
            imports: [
                ApolloTestingModule,
                MatIconModule,
                NgbTooltipModule,
                HttpClientTestingModule,
                SharedTestModule,
                ExecuteTransformEventComponent,
                SizePropertyComponent,
                OffsetIntervalPropertyComponent,
                BlockRowDataComponent,
                TooltipIconComponent,
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(ExecuteTransformEventComponent);
        component = fixture.componentInstance;
        component.event = mockExecuteTransform as ExecuteTransform;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
