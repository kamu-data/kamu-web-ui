/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";

import { finalize } from "rxjs";

import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";
import { BaseComponent } from "@common/components/base.component";
import { MY_MOMENT_FORMATS } from "@common/helpers/data.helpers";
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OwlDateTimeModule } from "@danielmoncada/angular-datetime-picker";
import { MomentDateTimeAdapter, OwlMomentDateTimeModule } from "@danielmoncada/angular-datetime-picker-moment-adapter";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { format, isAfter } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { MaybeNullOrUndefined } from "src/app/interface/app.types";

import { DatasetCommitService } from "../../services/dataset-commit.service";

@Component({
    selector: "app-edit-watermark-modal",
    templateUrl: "./edit-watermark-modal.component.html",
    styleUrls: ["./edit-watermark-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        { provide: DateTimeAdapter, useClass: MomentDateTimeAdapter },
        { provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS },
    ],
    imports: [
        //-----//
        FormsModule,
        //-----//
        MatDividerModule,
        MatIconModule,
        OwlDateTimeModule,
        OwlMomentDateTimeModule,
    ],
})
export class EditWatermarkModalComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public currentWatermark: MaybeNullOrUndefined<string>;
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    public date: Date;

    public timeZone = this.currentTimeZone;

    public activeModal = inject(NgbActiveModal);
    private datasetCommitService = inject(DatasetCommitService);
    private loggedUserService = inject(LoggedUserService);

    public ngOnInit(): void {
        this.date = new Date();
    }

    public get isDateValid(): boolean {
        return isAfter(this.currentWatermark as string, this.date);
    }

    public get currentTimeZone(): string {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
    }

    public createOffset(): string {
        return format(new Date(), "zzzz");
    }

    public get minLocalWatermark(): string {
        return this.currentWatermark ? new Date(this.currentWatermark).toISOString() : "";
    }

    public commitSetWatermarkEvent(): void {
        const date = toZonedTime(this.date.toISOString(), this.timeZone).toISOString();
        this.datasetCommitService
            .updateWatermark({
                accountId: this.loggedUserService.currentlyLoggedInUser.id,
                datasetId: this.datasetBasics.id,
                watermark: date,
                datasetInfo: {
                    accountName: this.datasetBasics.owner.accountName,
                    datasetName: this.datasetBasics.name,
                },
            })
            .pipe(
                finalize(() => this.activeModal.close()),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }
}
