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
import { provideToastr } from "ngx-toastr";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";

describe("ExecuteTransformEventComponent", () => {
    let component: ExecuteTransformEventComponent;
    let fixture: ComponentFixture<ExecuteTransformEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [provideToastr()],
            imports: [ApolloTestingModule, HttpClientTestingModule, SharedTestModule, ExecuteTransformEventComponent],
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
