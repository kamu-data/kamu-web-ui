/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideToastr } from "ngx-toastr";
import { ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockAddData } from "../../mock.events";
import { AddDataEventComponent } from "./add-data-event.component";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { Apollo } from "apollo-angular";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";

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
    imports: [SharedTestModule, AddDataEventComponent],
    providers: [Apollo, provideToastr(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
