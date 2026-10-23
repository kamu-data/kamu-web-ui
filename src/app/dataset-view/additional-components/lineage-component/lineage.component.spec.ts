/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Node } from "@swimlane/ngx-graph";
import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { LineageGraphComponent } from "@common/components/lineage-graph/lineage-graph.component";
import {
    findComponentInstance,
    findComponentInstances,
    findElementByDataTestId,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { AccountService } from "src/app/account/account.service";
import { mockLineageGraphUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { LineageGraphNodeData } from "src/app/dataset-view/additional-components/lineage-component/lineage-model";
import { LineageComponent } from "src/app/dataset-view/additional-components/lineage-component/lineage.component";
import { mockLineageUpdateWithLoneDerivative } from "src/app/dataset-view/additional-components/lineage-component/services/lineage-graph-builder.mock";
import { MOCK_DATASET_INFO } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { DatasetViewTypeEnum } from "src/app/dataset-view/dataset-view.interface";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { DatasetSubscriptionsService } from "src/app/dataset-view/dataset.subscriptions.service";
import { mockNode, mockNodesWithEqualNames } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

describe("LineageComponent", () => {
    let component: LineageComponent;
    let fixture: ComponentFixture<LineageComponent>;
    let accountService: AccountService;
    let navigationService: NavigationService;
    let toastrService: ToastrService;
    let navigationServiceSpy: jasmine.Spy;
    let datasetService: DatasetService;
    let datasetSubsService: DatasetSubscriptionsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [SharedTestModule, LineageComponent],
        }).compileComponents();

        accountService = TestBed.inject(AccountService);
        navigationService = TestBed.inject(NavigationService);
        toastrService = TestBed.inject(ToastrService);
        datasetService = TestBed.inject(DatasetService);
        spyOn(datasetService, "requestDatasetLineage").and.returnValue(of(undefined));
        datasetSubsService = TestBed.inject(DatasetSubscriptionsService);
        spyOn(accountService, "fetchMultipleAccountsByName").and.returnValue(of());
        navigationServiceSpy = spyOn(navigationService, "navigateToDatasetView");

        fixture = TestBed.createComponent(LineageComponent);
        component = fixture.componentInstance;
        component.datasetInfo = MOCK_DATASET_INFO;
        fixture.detectChanges();
    });

    // ngx-graph schedules its first layout pass on a timer it does not cancel on destroy
    afterEach(async () => {
        await fixture.whenStable();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should render the graph of the lineage", () => {
        datasetSubsService.emitLineageChanged(mockLineageGraphUpdate);
        fixture.detectChanges();

        const graph = findComponentInstance(fixture, LineageGraphComponent);
        expect(graph.currentDataset).toEqual(mockLineageGraphUpdate.origin);
        expect(graph.graph.nodes.length).toBeGreaterThan(0);
        expect(findElementByDataTestId(fixture, "lineage-not-enough-data")).toBeUndefined();
    });

    it("should explain why a derivative without a lineage has no graph", () => {
        datasetSubsService.emitLineageChanged(mockLineageUpdateWithLoneDerivative);
        fixture.detectChanges();

        expect(findComponentInstances(fixture, LineageGraphComponent)).toEqual([]);
        expect(findElementByDataTestId(fixture, "lineage-not-enough-data")).toBeDefined();
    });

    it("should check click on lineage node ", () => {
        fixture.detectChanges();
        const selectDatasetSpy = spyOn(component, "onSelectDataset");
        component.onClickNode(mockNode);

        const mockNodeData: LineageGraphNodeData = mockNode.data as LineageGraphNodeData;
        expect(selectDatasetSpy).toHaveBeenCalledWith(
            mockNodeData.dataObject.accountName,
            mockNodeData.dataObject.name,
        );
    });

    it("should check click on private node", () => {
        const toastrServiceSpy = spyOn(toastrService, "success");
        component.onClickPrivateNode(mockNode);
        expect(toastrServiceSpy).toHaveBeenCalledOnceWith("Copied ID");
    });

    it("should check click on lineage nodes with equal dataset name, but different account name ", () => {
        fixture.detectChanges();
        mockNodesWithEqualNames.forEach((node: Node) => {
            component.onClickNode(node);
            const mockNodeData = node.data as LineageGraphNodeData;
            expect(navigationServiceSpy).toHaveBeenCalledWith({
                accountName: mockNodeData.dataObject.accountName,
                datasetName: mockNodeData.dataObject.name,
                tab: DatasetViewTypeEnum.Lineage,
            });
        });
    });

    it("should check #selectDataset with account and dataset name", () => {
        fixture.detectChanges();
        const testAccountName = "john";
        const testDatasetName = "alberta.tcc";
        component.onSelectDataset(testAccountName, testDatasetName);
        expect(navigationServiceSpy).toHaveBeenCalledWith(
            jasmine.objectContaining({ accountName: testAccountName, datasetName: testDatasetName }),
        );
    });
});
