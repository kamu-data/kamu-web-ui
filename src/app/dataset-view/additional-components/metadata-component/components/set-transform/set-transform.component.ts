import { DatasetBasicsFragment, DatasetKind, TransformInput } from "../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { MaybeNull, MaybeNullOrUndefined } from "src/app/common/app.types";
import { DatasetSchema } from "src/app/interface/dataset.interface";
import { GetDatasetSchemaQuery, SqlQueryStep } from "src/app/api/kamu.graphql.interface";
import { EditSetTransformService } from "./edit-set-transform..service";
import { parseCurrentSchema } from "src/app/common/app.helpers";
import { DatasetNode, SetTransFormYamlType } from "./set-transform.types";
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
import { from } from "rxjs";
import { BaseMainEventComponent } from "../base-main-event.component";

@Component({
    selector: "app-set-transform",
    templateUrl: "./set-transform.component.html",
    styleUrls: ["./set-transform.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetTransformComponent extends BaseMainEventComponent implements OnInit {
    public inputDatasets = new Set<string>();
    public selectedEngine: string;
    public currentSetTransformEvent: MaybeNull<SetTransFormYamlType>;
    public queries: Omit<SqlQueryStep, "__typename">[] = [];
    public dataSource = new MatTreeNestedDataSource<DatasetNode>();
    public TREE_DATA: DatasetNode[] = [];

    constructor(private editService: EditSetTransformService) {
        super();
    }

    public ngOnInit(): void {
        this.checkDatasetEditability(DatasetKind.Derivative);
        this.initQueriesSection();
        this.subsribeErrorMessage();
    }

    public onSelectEngine(engine: string): void {
        this.selectedEngine = engine;
    }

    public get isInputDatasetsExist(): boolean {
        return !!this.inputDatasets.size;
    }

    private initQueriesSection(): void {
        this.trackSubscription(
            this.editService
                .getEventAsYaml(this.getDatasetInfoFromUrl(), SupportedEvents.SetTransform)
                .subscribe((result: MaybeNullOrUndefined<string>) => {
                    if (result) {
                        this.eventYamlByHash = result;
                        this.currentSetTransformEvent = this.editService.parseEventFromYaml(this.eventYamlByHash);
                        if (this.currentSetTransformEvent.transform.query) {
                            this.initDefaultQueriesSection(this.currentSetTransformEvent.transform.query);
                        } else {
                            this.queries = this.currentSetTransformEvent.transform.queries;
                        }
                        this.getInputDatasetsInfo();
                    } else {
                        this.initDefaultQueriesSection();
                    }
                    this.history = this.editService.history;
                    this.cdr.detectChanges();
                }),
        );
    }

    private initDefaultQueriesSection(query = ""): void {
        this.queries = [...this.queries, { alias: this.getDatasetInfoFromUrl().datasetName, query }];
    }

    private getInputDatasetsInfo(): void {
        this.currentSetTransformEvent?.inputs.forEach((item: TransformInput) => {
            if (item.id) {
                this.inputDatasets.add(JSON.stringify(item));
                this.trackSubscription(
                    this.datasetService.requestDatasetSchema(item.id).subscribe((data: GetDatasetSchemaQuery) => {
                        if (data.datasets.byId) {
                            const owner = (data.datasets.byId as DatasetBasicsFragment).owner.accountName;
                            const schema: MaybeNull<DatasetSchema> = parseCurrentSchema(
                                data.datasets.byId.metadata.currentSchema,
                            );
                            this.TREE_DATA.push({
                                name: item.name,
                                children: schema?.fields,
                                owner,
                            });
                            this.dataSource.data = this.TREE_DATA;
                        }
                    }),
                );
            } else {
                throw new Error("TransformInput without an 'id' is unexpected");
            }
        });
    }

    public onEditYaml(): void {
        const modalRef: NgbModalRef = this.modalService.open(FinalYamlModalComponent, { size: "lg" });
        const instance = modalRef.componentInstance as FinalYamlModalComponent;
        instance.yamlTemplate =
            this.errorMessage && this.changedEventYamlByHash
                ? this.changedEventYamlByHash
                : this.yamlEventService.buildYamlSetTransformEvent(
                      this.editService.transformEventAsObject(this.inputDatasets, this.selectedEngine, this.queries),
                  );
        instance.datasetInfo = this.getDatasetInfoFromUrl();
        instance.enabledSaveBtn = this.isInputDatasetsExist;
        this.trackSubscription(
            from(modalRef.result).subscribe((eventYaml: string) => {
                this.changedEventYamlByHash = eventYaml;
            }),
        );
    }

    public onSaveEvent(): void {
        this.trackSubscription(
            this.datasetCommitService
                .commitEventToDataset(
                    this.getDatasetInfoFromUrl().accountName,
                    this.getDatasetInfoFromUrl().datasetName,
                    this.yamlEventService.buildYamlSetTransformEvent(
                        this.editService.transformEventAsObject(this.inputDatasets, this.selectedEngine, this.queries),
                    ),
                )
                .subscribe(),
        );
    }
}
