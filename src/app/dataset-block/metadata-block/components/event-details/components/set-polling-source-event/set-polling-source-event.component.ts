import { DataHelpers } from "src/app/common/data.helpers";
import {
    FetchStepFilesGlob,
    FetchStepUrl,
    MergeStrategyLedger,
    ReadStepCsv,
    SetPollingSource,
} from "./../../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { DatasetInfo } from "src/app/interface/navigation.interface";

@Component({
    selector: "app-set-polling-source-event",
    templateUrl: "./set-polling-source-event.component.html",
    styleUrls: ["./set-polling-source-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetPollingSourceEventComponent {
    @Input() public event: SetPollingSource;
    @Input() public datasetInfo: DatasetInfo;

    public isYamlView = false;

    public get fetchStepUrl(): FetchStepUrl {
        return this.event.fetch as FetchStepUrl;
    }

    public get isFetchStepUrl(): boolean {
        return this.event.fetch.__typename === "FetchStepUrl";
    }

    public get fetchStepFilesGlob(): FetchStepFilesGlob {
        return this.event.fetch as FetchStepFilesGlob;
    }

    public get isFetchStepFilesGlob(): boolean {
        return this.event.fetch.__typename === "FetchStepFilesGlob";
    }

    public get readStepCsv(): ReadStepCsv {
        return this.event.read as ReadStepCsv;
    }

    public get isReadStepCsv(): boolean {
        return this.event.read.__typename === "ReadStepCsv";
    }

    public get mergeStrategyLedger(): MergeStrategyLedger {
        return this.event.merge as MergeStrategyLedger;
    }

    public get isMergeStrategyLedger(): boolean {
        return this.event.merge.__typename === "MergeStrategyLedger";
    }

    public descriptionEngine(name: string): {
        name: string;
        url_logo: string;
    } {
        return DataHelpers.descriptionForEngine(name);
    }

    public onToggleView(value: boolean): void {
        this.isYamlView = value;
    }
}
