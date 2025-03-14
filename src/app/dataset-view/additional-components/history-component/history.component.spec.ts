/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { first } from "rxjs/operators";
import { DatasetSubscriptionsService } from "../../dataset.subscriptions.service";
import { mockHistoryUpdate } from "../data-tabs.mock";
import { HistoryComponent } from "./history.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { PaginationComponent } from "src/app/common/components/pagination-component/pagination.component";
import { TimelineComponent } from "src/app/common/components/timeline-component/timeline.component";
import { NgbPaginationModule, NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { DisplayHashComponent } from "src/app/common/components/display-hash/display-hash.component";
import { DisplayTimeComponent } from "src/app/common/components/display-time/display-time.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ToastrModule } from "ngx-toastr";
import { MatIconModule } from "@angular/material/icon";
import { RouterTestingModule } from "@angular/router/testing";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";

describe("HistoryComponent", () => {
    let component: HistoryComponent;
    let fixture: ComponentFixture<HistoryComponent>;
    let datasetSubsService: DatasetSubscriptionsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                HistoryComponent,
                PaginationComponent,
                TimelineComponent,
                DisplayTimeComponent,
                DisplayHashComponent,
            ],
            imports: [
                HttpClientTestingModule,
                NgbPaginationModule,
                NgbPopoverModule,
                MatIconModule,
                RouterTestingModule,
                SharedTestModule,
                ToastrModule.forRoot(),
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(HistoryComponent);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        component = fixture.componentInstance;
        datasetSubsService.emitHistoryChanged(mockHistoryUpdate);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check change page", () => {
        const testChangeNotification = 1;

        const emitterSubscription$ = component.onPageChangeEmit
            .pipe(first())
            .subscribe((notification) => expect(notification).toEqual(testChangeNotification));

        component.onPageChange(testChangeNotification);
        expect(emitterSubscription$.closed).toBeTrue();
    });
});
