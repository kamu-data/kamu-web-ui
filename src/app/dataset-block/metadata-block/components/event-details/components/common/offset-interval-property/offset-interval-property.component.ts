import { NavigationService } from "./../../../../../../../services/navigation.service";
import { BasePropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/base-property/base-property.component";
import {
    ChangeDetectionStrategy,
    Component,
    Input,
    OnInit,
} from "@angular/core";
import { OffsetInterval } from "src/app/api/kamu.graphql.interface";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { requireValue } from "src/app/common/app.helpers";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import ProjectLinks from "src/app/project-links";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-interval-property",
    templateUrl: "./offset-interval-property.component.html",
    styleUrls: ["./offset-interval-property.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OffsetIntervalPropertyComponent
    extends BasePropertyComponent
    implements OnInit
{
    @Input() public data: OffsetInterval;
    constructor(
        private activatedRoute: ActivatedRoute,
        private navigationService: NavigationService,
    ) {
        super();
    }
    ngOnInit(): void {
        console.log(this.getDatasetInfoFromUrl());
        this;
    }

    public navigateToQuery(): void {
        this.navigationService.navigateToDatasetView({
            ...this.getDatasetInfoFromUrl(),
            tab: DatasetViewTypeEnum.Data,
            state: { start: this.data.start, end: this.data.end },
        });
    }

    private getDatasetInfoFromUrl(): DatasetInfo {
        const paramMap: ParamMap = this.activatedRoute.snapshot.paramMap;
        return {
            accountName: requireValue(
                paramMap.get(ProjectLinks.URL_PARAM_ACCOUNT_NAME),
            ),
            datasetName: requireValue(
                paramMap.get(ProjectLinks.URL_PARAM_DATASET_NAME),
            ),
        };
    }
}
