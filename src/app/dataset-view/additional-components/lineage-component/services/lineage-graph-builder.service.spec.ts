import { TestBed } from "@angular/core/testing";
import { LineageGraphBuilderService } from "./lineage-graph-builder.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { mockBuildGraphNodesResult, mockLineageGraphUpdate } from "../../data-tabs.mock";
import { LineageGraph, LineageGraphNodeData, LineageGraphNodeKind } from "../lineage-model";
import { DatasetLineageBasicsFragment } from "src/app/api/kamu.graphql.interface";

describe("LineageGraphBuilderService", () => {
    let service: LineageGraphBuilderService;
    let datasetSubsService: DatasetSubscriptionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LineageGraphBuilderService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        datasetSubsService.changeLineageData(mockLineageGraphUpdate);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check get current dataset", () => {
        service.getCurrentDataset().subscribe((data: DatasetLineageBasicsFragment) => {
            expect(data).toEqual(mockLineageGraphUpdate.origin);
        });
    });

    it("should check build graph", () => {
        service.buildGraph().subscribe((data: LineageGraph) => {
            expect(data).toBeDefined();
            expect(data.links.length).toEqual(4);
            expect(data.nodes.length).toEqual(5);
        });
    });

    it("should check source nodes length", () => {
        service.buildGraph().subscribe((data: LineageGraph) => {
            const dataSource = mockLineageGraphUpdate.nodes.filter(
                (node) => node.metadata.currentSource?.fetch.__typename === "FetchStepUrl",
            );
            const graphSourceNodes = data.nodes.filter(
                (node) => (node.data as LineageGraphNodeData).kind === LineageGraphNodeKind.Source,
            );
            expect(dataSource.length).toEqual(graphSourceNodes.length);
        });
    });

    it("should check nodes were built correctly", () => {
        service.buildGraph().subscribe((data: LineageGraph) => {
            expect(data.nodes).toEqual(mockBuildGraphNodesResult);
        });
    });
});
