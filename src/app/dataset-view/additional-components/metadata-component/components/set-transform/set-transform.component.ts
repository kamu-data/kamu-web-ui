import { DatasetBasicsFragment, DatasetKind, TransformInput } from "../../../../../api/kamu.graphql.interface";
import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { MaybeNull, MaybeNullOrUndefined } from "src/app/common/types/app.types";
import { DatasetSchema } from "src/app/interface/dataset.interface";
import { GetDatasetSchemaQuery, SqlQueryStep } from "src/app/api/kamu.graphql.interface";
import { EditSetTransformService } from "./edit-set-transform..service";
import { parseCurrentSchema } from "src/app/common/helpers/app.helpers";
import { DatasetNode, SetTransformYamlType } from "./set-transform.types";
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { SupportedEvents } from "src/app/dataset-block/metadata-block/components/event-details/supported.events";
import { from } from "rxjs";
import { BaseMainEventComponent } from "../source-events/base-main-event.component";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
    selector: "app-set-transform",
    templateUrl: "./set-transform.component.html",
    styleUrls: ["./set-transform.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SetTransformComponent extends BaseMainEventComponent implements OnInit {
    public inputDatasets = new Set<string>();
    public selectedEngine: string;
    public currentSetTransformEvent: MaybeNull<SetTransformYamlType>;
    public queries: Omit<SqlQueryStep, "__typename">[] = [];
    public dataSource = new MatTreeNestedDataSource<DatasetNode>();
    public TREE_DATA: DatasetNode[] = [];

    private editService = inject(EditSetTransformService);

    public ngOnInit(): void {
        this.checkDatasetEditability(DatasetKind.Derivative);
        this.initQueriesSection();
        this.subscribeErrorMessage();
    }

    public onSelectEngine(engine: string): void {
        this.selectedEngine = engine;
    }

    public get isInputDatasetsExist(): boolean {
        return !!this.inputDatasets.size;
    }

    private initQueriesSection(): void {
        this.editService
            .getEventAsYaml(this.getDatasetInfoFromUrl(), SupportedEvents.SetTransform)
            .pipe(takeUntilDestroyed(this.destroyRef))
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
            });
    }

    private initDefaultQueriesSection(query = ""): void {
        this.queries = [...this.queries, { query }];
    }

    private getInputDatasetsInfo(): void {
        this.currentSetTransformEvent?.inputs.forEach((item: TransformInput) => {
            if (item.datasetRef) {
                this.inputDatasets.add(JSON.stringify(item));

                this.datasetService
                    .requestDatasetSchema(item.datasetRef)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe((data: GetDatasetSchemaQuery) => {
                        if (data.datasets.byId) {
                            const owner = (data.datasets.byId as DatasetBasicsFragment).owner.accountName;
                            const schema: MaybeNull<DatasetSchema> = parseCurrentSchema(
                                data.datasets.byId.metadata.currentSchema,
                            );
                            this.TREE_DATA.push({
                                name: item.alias,
                                children: schema?.fields,
                                owner,
                            });
                            this.dataSource.data = this.TREE_DATA;
                        }
                    });
            } else {
                throw new Error("TransformInput without an 'datasetRef' is unexpected");
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

        from(modalRef.result)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((eventYaml: string) => {
                this.changedEventYamlByHash = eventYaml;
            });
    }

    public onSaveEvent(): void {
        this.datasetCommitService
            .commitEventToDataset({
                accountId: this.loggedUserService.currentlyLoggedInUser.id,
                accountName: this.getDatasetInfoFromUrl().accountName,
                datasetName: this.getDatasetInfoFromUrl().datasetName,
                event: this.yamlEventService.buildYamlSetTransformEvent(
                    this.editService.transformEventAsObject(this.inputDatasets, this.selectedEngine, this.queries),
                ),
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }
}
