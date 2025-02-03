import { DatasetByIdQuery } from "../../../../../../../api/kamu.graphql.interface";
import { NavigationService } from "../../../../../../../services/navigation.service";
import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { OffsetInterval } from "src/app/api/kamu.graphql.interface";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { MaybeNull } from "src/app/common/types/app.types";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-interval-property",
    templateUrl: "./offset-interval-property.component.html",
    styleUrls: ["./offset-interval-property.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffsetIntervalPropertyComponent extends BasePropertyComponent implements OnInit {
    @Input({ required: true }) public data: {
        block: MaybeNull<OffsetInterval>;
        datasetId: MaybeNull<string>;
    };
    private datasetInfo: DatasetInfo = { accountName: "", datasetName: "" };
    private navigationService = inject(NavigationService);
    private datasetService = inject(DatasetService);

    public ngOnInit(): void {
        if (this.data.datasetId) {
            this.datasetService
                .requestDatasetInfoById(this.data.datasetId)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe((dataset: DatasetByIdQuery) => {
                    if (dataset.datasets.byId) {
                        this.datasetInfo.accountName = dataset.datasets.byId.owner.accountName;
                        this.datasetInfo.datasetName = dataset.datasets.byId.name;
                    }
                });
        }
    }

    public navigateToQuery(): void {
        if (!this.data.datasetId) {
            this.datasetInfo = this.getDatasetInfoFromUrl();
        }
        if (this.data.block) {
            this.navigationService.navigateToDatasetView({
                ...this.datasetInfo,
                tab: DatasetViewTypeEnum.Data,
                state: {
                    start: this.data.block.start,
                    end: this.data.block.end,
                },
            });
        }
    }
}
