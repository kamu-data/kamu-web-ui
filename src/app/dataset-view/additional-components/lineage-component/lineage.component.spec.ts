/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { SharedTestModule } from "@common/modules/shared-test.module";
import { Node } from "@swimlane/ngx-graph";
import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";
import { AccountService } from "src/app/account/account.service";
import { NavigationService } from "src/app/services/navigation.service";

import { mockNode, mockNodesWithEqualNames } from "../../../search/mock.data";
import { DatasetViewTypeEnum } from "../../dataset-view.interface";
import { DatasetService } from "../../dataset.service";
import { MOCK_DATASET_INFO } from "../metadata-component/components/set-transform/mock.data";
import { LineageGraphNodeData } from "./lineage-model";
import { LineageComponent } from "./lineage.component";

describe("LineageComponent", () => {
    let component: LineageComponent;
    let fixture: ComponentFixture<LineageComponent>;
    let accountService: AccountService;
    let navigationService: NavigationService;
    let toastrService: ToastrService;
    let navigationServiceSpy: jasmine.Spy;
    let datasetService: DatasetService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
            imports: [SharedTestModule, LineageComponent],
        }).compileComponents();

        accountService = TestBed.inject(AccountService);
        navigationService = TestBed.inject(NavigationService);
        toastrService = TestBed.inject(ToastrService);
        datasetService = TestBed.inject(DatasetService);
        spyOn(datasetService, "requestDatasetLineage").and.returnValue(of());
        spyOn(accountService, "fetchMultipleAccountsByName").and.returnValue(of());
        navigationServiceSpy = spyOn(navigationService, "navigateToDatasetView");

        fixture = TestBed.createComponent(LineageComponent);
        component = fixture.componentInstance;
        component.datasetInfo = MOCK_DATASET_INFO;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
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
