import { EventRow, EventSection } from "./../../factory.events";
import { DataHelpers } from "src/app/common/data.helpers";
import {
    FetchStepFilesGlob,
    FetchStepUrl,
    MergeStrategyLedger,
    ReadStepCsv,
    SetPollingSource,
} from "./../../../../../../api/kamu.graphql.interface";
import {
    AfterViewChecked,
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

import { LogoInfo } from "../../supported.events";
import { FACTORIES_BY_EVENT_TYPE } from "../../factory.events";
import { BasePropertyComponent } from "../common/base-property/base-property.component";

@Component({
    selector: "app-set-polling-source-event",
    templateUrl: "./set-polling-source-event.component.html",
    styleUrls: ["./set-polling-source-event.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetPollingSourceEventComponent
    implements OnInit, AfterViewChecked
{
    @Input() public event: SetPollingSource;
    @Input() public datasetInfo: DatasetInfo;
    @ViewChildren("container", { read: ViewContainerRef })
    container: QueryList<ViewContainerRef>;
    public isYamlView = false;
    public eventSections: EventSection[];
    public queriesLabel = "Queries:";

    public constructor(private cdr: ChangeDetectorRef) {}

    ngAfterViewChecked(): void {
        if (!this.isYamlView) {
            let componentRef: ComponentRef<BasePropertyComponent>;
            const rows: EventRow[] = [];
            this.eventSections
                .map((item) => item.rows)
                .forEach((item: EventRow[]) => {
                    rows.push(...item);
                });
            this.container.map((vcr: ViewContainerRef, index: number) => {
                vcr.clear();
                componentRef = vcr.createComponent(
                    rows[index].presentationComponent,
                );
                componentRef.instance.data = rows[index].value;
            });
            this.cdr.detectChanges();
        }
    }

    ngOnInit(): void {
        this.eventSections =
            FACTORIES_BY_EVENT_TYPE.SetPollingSource.buildEventRows(this.event);
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

    public descriptionEngine(name: string): LogoInfo {
        return DataHelpers.descriptionForEngine(name);
    }

    public onToggleView(value: boolean): void {
        this.isYamlView = value;
    }
}
