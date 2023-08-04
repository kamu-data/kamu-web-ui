import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SetTransformComponent } from "./set-transform.component";
import { Apollo, ApolloModule } from "apollo-angular";
import { ActivatedRoute } from "@angular/router";
import { ApolloTestingModule } from "apollo-angular/testing";
import { EditSetTransformService } from "./edit-set-transform..service";
import { DatasetKind } from "src/app/api/kamu.graphql.interface";
import { of } from "rxjs";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { FinalYamlModalComponent } from "../final-yaml-modal/final-yaml-modal.component";
import { MonacoEditorModule } from "ngx-monaco-editor";
import {
    mockGetDatasetSchemaQuery,
    mockParseSetTransFormYamlType,
    mockSetTransformEventYaml,
    mockSetTransformEventYamlWithQuery,
} from "./mock.data";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { MatTreeNestedDataSource } from "@angular/material/tree";
import { DatasetNode } from "./set-transform.types";
import { DatasetCommitService } from "../../../overview-component/services/dataset-commit.service";

describe("SetTransformComponent", () => {
    let component: SetTransformComponent;
    let fixture: ComponentFixture<SetTransformComponent>;
    let editService: EditSetTransformService;
    let datasetCommitService: DatasetCommitService;
    let modalService: NgbModal;
    let modalRef: NgbModalRef;
    let datasetService: DatasetService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SetTransformComponent],
            imports: [
                ApolloModule,
                ApolloTestingModule,
                MonacoEditorModule.forRoot(),
            ],
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return "accountName";
                                        case "datasetName":
                                            return "datasetName";
                                    }
                                },
                            },
                        },
                    },
                },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SetTransformComponent);

        component = fixture.componentInstance;
        component.selectedEngine = "Spark";
        component.dataSource = new MatTreeNestedDataSource<DatasetNode>();
        component.inputDatasets = new Set<string>([
            '{"id":"did:odf:z4k88e8ctFydBwcEhtvaB9AuBL6L2kfGnNvS1LjPGLA51owXkxX","name":"account.tokens.portfolio.usd"}',
        ]);
        modalService = TestBed.inject(NgbModal);
        modalRef = modalService.open(FinalYamlModalComponent);
        editService = TestBed.inject(EditSetTransformService);
        datasetCommitService = TestBed.inject(DatasetCommitService);
        datasetService = TestBed.inject(DatasetService);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check select engine", () => {
        const engine = "Flink";
        component.onSelectEngine(engine);

        expect(component.selectedEngine).toEqual(engine);
    });

    it("should check save event", () => {
        const commitEventToDatasetSpy = spyOn(
            datasetCommitService,
            "commitEventToDataset",
        ).and.returnValue(of());
        component.onSaveEvent();
        expect(commitEventToDatasetSpy).toHaveBeenCalledTimes(1);
    });

    it("should check open edit modal", () => {
        editService.changeKindChanges(DatasetKind.Derivative);
        component.ngOnInit();
        const openModalSpy = spyOn(modalService, "open").and.returnValue(
            modalRef,
        );
        component.onEditYaml();
        expect(component.datasetKind).toEqual(DatasetKind.Derivative);
        expect(openModalSpy).toHaveBeenCalledTimes(1);
    });

    it("should check init queries section with queries", () => {
        spyOn(editService, "getEventAsYaml").and.callFake(() =>
            of(mockSetTransformEventYaml),
        );
        spyOn(datasetService, "requestDatasetSchema").and.callFake(() =>
            of(mockGetDatasetSchemaQuery),
        );
        component.ngOnInit();
        expect(component.currentSetTransformEvent).toEqual(
            mockParseSetTransFormYamlType,
        );
        expect(component.TREE_DATA.length).toBe(2);
    });

    it("should check init queries section with query", () => {
        spyOn(editService, "getEventAsYaml").and.callFake(() =>
            of(mockSetTransformEventYamlWithQuery),
        );
        spyOn(datasetService, "requestDatasetSchema").and.callFake(() =>
            of(mockGetDatasetSchemaQuery),
        );
        component.ngOnInit();

        expect(component.queries.length).toBe(1);
        expect(component.queries[0].query).not.toBeNull();
    });

    it("should check init queries section when event is null", () => {
        spyOn(editService, "getEventAsYaml").and.callFake(() => of(null));
        spyOn(datasetService, "requestDatasetSchema").and.callFake(() =>
            of(mockGetDatasetSchemaQuery),
        );
        component.ngOnInit();

        expect(component.queries.length).toBe(1);
        expect(component.queries[0].query).toBe("");
    });
});
