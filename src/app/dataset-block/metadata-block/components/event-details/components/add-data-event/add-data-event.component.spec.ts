/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideToastr } from "ngx-toastr";
import { ApolloModule } from "apollo-angular";
import { SizePropertyComponent } from "../common/size-property/size-property.component";
import { ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockAddData } from "../../mock.events";
import { AddDataEventComponent } from "./add-data-event.component";
import { OffsetIntervalPropertyComponent } from "../common/offset-interval-property/offset-interval-property.component";
import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("AddDataEventComponent", () => {
    let component: AddDataEventComponent;
    let fixture: ComponentFixture<AddDataEventComponent>;

    const mockSimpleChanges = {
        event: {
            previousValue: undefined,
            currentValue: undefined,
            firstChange: false,
            isFirstChange: () => true,
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [provideAnimations(), provideToastr()],
            imports: [
                ApolloModule,
                MatIconModule,
                NgbTooltipModule,
                HttpClientTestingModule,
                SharedTestModule,
                AddDataEventComponent,
                SizePropertyComponent,
                OffsetIntervalPropertyComponent,
                BlockRowDataComponent,
                TooltipIconComponent,
            ],
        })
            .overrideComponent(AddDataEventComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(AddDataEventComponent);
        component = fixture.componentInstance;
        component.event = mockAddData;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check onChanges hook call", () => {
        const spyNgOnChanges = spyOn(component, "ngOnChanges").and.callThrough();
        fixture.detectChanges();
        component.ngOnChanges(mockSimpleChanges);
        expect(spyNgOnChanges).toHaveBeenCalledTimes(1);
    });
});
