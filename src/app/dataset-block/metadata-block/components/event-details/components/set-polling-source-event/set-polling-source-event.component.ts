import { EventRow } from "./../../factory.events";
import { DataHelpers } from "src/app/common/data.helpers";
import {
    FetchStepFilesGlob,
    FetchStepUrl,
    MergeStrategyLedger,
    ReadStepCsv,
    SetPollingSource,
} from "./../../../../../../api/kamu.graphql.interface";
import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    Input,
    OnInit,
    QueryList,
    ViewChildren,
    ViewContainerRef,
} from "@angular/core";
import { DatasetInfo } from "src/app/interface/navigation.interface";
import { sqlEditorOptionsForEvents } from "../../config-editor.events";
import { LogoInfo } from "../../supported.events";
import { FACTORIES_BY_EVENT_TYPE } from "../../factory.events";
import { BasePropertyComponent } from "../common/base-property/base-property.component";

@Component({
    selector: "app-set-polling-source-event",
    templateUrl: "./set-polling-source-event.component.html",
    styleUrls: ["./set-polling-source-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetPollingSourceEventComponent implements OnInit, AfterViewInit {
    @Input() public event: SetPollingSource;
    @Input() public datasetInfo: DatasetInfo;
    @ViewChildren("readStepContainer", { read: ViewContainerRef })
    readStepContainer: QueryList<ViewContainerRef>;
    public isYamlView = false;
    public sqlEditorOptions = sqlEditorOptionsForEvents;
    public readStepCsvData: EventRow[];
    private componentRef: ComponentRef<BasePropertyComponent>;

    public constructor(private cdr: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.readStepCsvData =
            FACTORIES_BY_EVENT_TYPE.SetPollingSource.buildEventRows(this.event);
    }

    ngAfterViewInit(): void {
        this.readStepContainer.map((vcr: ViewContainerRef, index: number) => {
            vcr.clear();
            this.componentRef = vcr.createComponent(
                this.readStepCsvData[index].presentationComponent,
            );
            this.componentRef.instance.data = this.readStepCsvData[index].value;
        });
        this.cdr.detectChanges();
    }

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

    public descriptionMergeStrategy(type: string | undefined): LogoInfo {
        return DataHelpers.descriptionMergeStrategy(type);
    }

    public descriptionEngine(name: string): LogoInfo {
        return DataHelpers.descriptionForEngine(name);
    }

    public onToggleView(value: boolean): void {
        this.isYamlView = value;
    }
}
