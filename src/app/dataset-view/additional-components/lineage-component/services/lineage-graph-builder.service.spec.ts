import { TestBed } from "@angular/core/testing";
import { LineageGraphBuilderService } from "./lineage-graph-builder.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import {
    mockBuildGraphNodesResult,
    mockLineageGraphUpdate,
    mockLineageGraphUpdateWithMqttSource,
} from "../../data-tabs.mock";
import { LineageGraphNodeData, LineageGraphNodeKind, LineageGraphUpdate } from "../lineage-model";
import { MaybeNull } from "src/app/common/types/app.types";

describe("LineageGraphBuilderService", () => {
    let service: LineageGraphBuilderService;
    let datasetSubsService: DatasetSubscriptionsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LineageGraphBuilderService);
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        datasetSubsService.emitLineageChanged(mockLineageGraphUpdate);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    it("should check null on the input results in null on the output", () => {
        datasetSubsService.emitLineageChanged(null);
        service.buildGraph().subscribe((update: MaybeNull<LineageGraphUpdate>) => {
            expect(update).toBeNull();
        });
    });

    it("should check get current dataset", () => {
        service.buildGraph().subscribe((update: MaybeNull<LineageGraphUpdate>) => {
            expect(update).toBeDefined();
            if (update) {
                expect(update.originDataset).toEqual(mockLineageGraphUpdate.origin);
            }
        });
    });

    it("should check build graph", () => {
        service.buildGraph().subscribe((update: MaybeNull<LineageGraphUpdate>) => {
            expect(update).toBeDefined();
            if (update) {
                expect(update.graph.links.length).toEqual(4);
                expect(update.graph.nodes.length).toEqual(5);
            }
        });
    });

    it("should check source nodes length with URL", () => {
        service.buildGraph().subscribe((update: MaybeNull<LineageGraphUpdate>) => {
            expect(update).toBeDefined();
            if (update) {
                const dataSourceUrl = mockLineageGraphUpdate.nodes.filter(
                    (node) => node.metadata.currentPollingSource?.fetch.__typename === "FetchStepUrl",
                );
                const graphSourceNodesUrl = update.graph.nodes.filter(
                    (node) => (node.data as LineageGraphNodeData).kind === LineageGraphNodeKind.Source,
                );
                expect(dataSourceUrl.length).toEqual(graphSourceNodesUrl.length);
            }
        });
    });

    it("should check source nodes length with MQTT", () => {
        datasetSubsService.emitLineageChanged(mockLineageGraphUpdateWithMqttSource);
        service.buildGraph().subscribe((update: MaybeNull<LineageGraphUpdate>) => {
            expect(update).toBeDefined();
            if (update) {
                const dataSourceMqtt = mockLineageGraphUpdateWithMqttSource.nodes.filter(
                    (node) => node.metadata.currentPollingSource?.fetch.__typename === "FetchStepMqtt",
                );
                const graphSourceNodesMqtt = update.graph.nodes.filter(
                    (node) => (node.data as LineageGraphNodeData).kind === LineageGraphNodeKind.Mqtt,
                );
                expect(dataSourceMqtt.length).toEqual(graphSourceNodesMqtt.length);
            }
        });
    });

    it("should check nodes were built correctly", () => {
        service.buildGraph().subscribe((update: MaybeNull<LineageGraphUpdate>) => {
            expect(update).toBeDefined();
            if (update) {
                expect(update.graph.nodes).toEqual(mockBuildGraphNodesResult);
            }
        });
    });
});
