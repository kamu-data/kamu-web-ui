import { MaybeNullOrUndefined } from "../../../../../common/app.types";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { OWL_DATE_TIME_FORMATS } from "@danielmoncada/angular-datetime-picker";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import moment from "moment-timezone";
import { DatasetBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { BaseComponent } from "src/app/common/base.component";
import { MY_MOMENT_FORMATS } from "src/app/common/data.helpers";
import { DatasetCommitService } from "../../services/dataset-commit.service";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { finalize } from "rxjs";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-edit-watermark-modal",
    templateUrl: "./edit-watermark-modal.component.html",
    styleUrls: ["./edit-watermark-modal.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: MY_MOMENT_FORMATS }],
})
export class EditWatermarkModalComponent extends BaseComponent implements OnInit {
    @Input({ required: true }) public currentWatermark: MaybeNullOrUndefined<string>;
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    public date: Date;
    public timeZone = this.currentTimeZone;

    public activeModal = inject(NgbActiveModal);
    private datasetCommitService = inject(DatasetCommitService);
    private loggedUserService = inject(LoggedUserService);

    ngOnInit(): void {
        this.date = new Date();
    }

    public get isDateValid(): boolean {
        return moment(this.currentWatermark).isAfter(this.date);
    }

    public get currentTimeZone(): string {
        return moment.tz.guess();
    }

    private pad(value: number): string {
        return value < 10 ? "0" + value.toString() : value.toString();
    }

    public createOffset(): string {
        return moment().format("Z");
    }

    public get minLocalWatermark(): string {
        return this.currentWatermark ? new Date(this.currentWatermark).toISOString() : "";
    }

    public commitSetWatermarkEvent(): void {
        const date = moment.utc(this.date).tz(this.timeZone).format();
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
