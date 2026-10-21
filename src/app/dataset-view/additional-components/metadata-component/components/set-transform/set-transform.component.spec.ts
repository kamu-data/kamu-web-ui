/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";

import { of, throwError } from "rxjs";

import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ApolloTestingModule } from "apollo-angular/testing";
import { provideToastr } from "ngx-toastr";

import { findComponentInstance } from "@common/helpers/base-test.helpers.spec";
import RoutingResolvers from "@common/resolvers/routing-resolvers";
import { mockAccountDetails } from "@api/mock/auth.mock";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { SearchSectionComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/search-section/search-section.component";
import {
    mockGetDatasetSchemaQuery,
    mockParseSetTransformYamlType,
    mockSetTransformEventYaml,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { SetTransformComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.component";
import {
    datasetNodeFromSchemaQuery,
    inputDatasetKey,
    unavailableDatasetNode,
} from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/set-transform.helpers";
import { DatasetCommitService } from "src/app/dataset-view/additional-components/overview-component/services/dataset-commit.service";
import { DatasetService } from "src/app/dataset-view/dataset.service";
import { mockDatasetInfo } from "src/app/search/mock.data";

describe("SetTransformComponent", () => {
    let component: SetTransformComponent;
    let fixture: ComponentFixture<SetTransformComponent>;

    let datasetCommitService: DatasetCommitService;
    let datasetService: DatasetService;
    let loggedUserService: LoggedUserService;
    let modalService: NgbModal;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, SetTransformComponent],
            providers: [
                provideToastr(),
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

        datasetCommitService = TestBed.inject(DatasetCommitService);
        datasetService = TestBed.inject(DatasetService);
        loggedUserService = TestBed.inject(LoggedUserService);
        modalService = TestBed.inject(NgbModal);

        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
    });

    function createComponent(eventYamlByHash: string): void {
        fixture = TestBed.createComponent(SetTransformComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput(RoutingResolvers.SET_TRANSFORM_KEY, eventYamlByHash);
        fixture.componentRef.setInput(RoutingResolvers.DATASET_INFO_KEY, mockDatasetInfo);
        fixture.detectChanges();
    }

    describe("editing an existing transform", () => {
        beforeEach(() => createComponent(mockSetTransformEventYaml));

        it("should create", () => {
            expect(component).toBeTruthy();
        });

        it("should check select engine", () => {
            const engine = "Flink";
            component.onSelectEngine(engine);

            expect(component.selectedEngine).toEqual(engine);
        });

        it("should check save event", () => {
            const commitEventToDatasetSpy = spyOn(datasetCommitService, "commitEventToDataset").and.returnValue(of());
            component.onSaveEvent();
            expect(commitEventToDatasetSpy).toHaveBeenCalledTimes(1);
        });

        it("should save the event's engine while the engine list has not loaded", () => {
            const commitEventToDatasetSpy = spyOn(datasetCommitService, "commitEventToDataset").and.returnValue(of());

            component.onSaveEvent();

            expect(commitEventToDatasetSpy.calls.mostRecent().args[0].event).toContain(
                `engine: ${mockParseSetTransformYamlType.transform.engine}`,
            );
        });

        it("should check open modal window to edit event", () => {
            const modalServiceOpenSpy = spyOn(modalService, "open").and.callThrough();
            component.onEditYaml();
            expect(modalServiceOpenSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe("loading input schemas", () => {
        beforeEach(() => {
            spyOn(datasetService, "requestDatasetSchema").and.callFake(() => of(mockGetDatasetSchemaQuery));
            createComponent(mockSetTransformEventYaml);
        });

        it("should init the inputs and queries from the event", () => {
            expect(component.currentSetTransformEvent).toEqual(mockParseSetTransformYamlType);
            expect(component.inputsViewModel.length).toBe(2);
            expect(component.queries.length).toBe(4);
            expect(component.queries[0].query).toBeDefined();
        });

        it("should keep the event's inputs when saving without changes", () => {
            const commitEventToDatasetSpy = spyOn(datasetCommitService, "commitEventToDataset").and.returnValue(of());

            component.onSaveEvent();

            const event = commitEventToDatasetSpy.calls.mostRecent().args[0].event;
            mockParseSetTransformYamlType.inputs.forEach((input) => {
                expect(event).toContain(input.datasetRef);
                expect(event).toContain(input.alias);
            });
        });

        it("should key each input by the alias stored in the event", () => {
            expect(component.inputsViewModel.map((item) => item.alias)).toEqual(
                mockParseSetTransformYamlType.inputs.map((input) => input.alias),
            );
        });
    });

    describe("when one input's schema fails to load", () => {
        const [failedInput, loadedInput] = mockParseSetTransformYamlType.inputs;

        beforeEach(() => {
            spyOn(datasetService, "requestDatasetSchema").and.callFake((datasetRef: string) =>
                datasetRef === failedInput.datasetRef
                    ? throwError(() => new Error("request failed"))
                    : of(mockGetDatasetSchemaQuery),
            );
            createComponent(mockSetTransformEventYaml);
        });

        it("should show both inputs in their original order, the failed one as unavailable", () => {
            expect(component.inputsViewModel).toEqual([
                unavailableDatasetNode(failedInput.alias),
                datasetNodeFromSchemaQuery(loadedInput.alias, mockGetDatasetSchemaQuery),
            ]);
        });

        it("should keep every input of the event in the selected inputs", () => {
            expect([...component.inputDatasets]).toEqual(
                mockParseSetTransformYamlType.inputs.map((input) => inputDatasetKey(input)),
            );
        });

        it("should delete the failed input by its alias", () => {
            const searchSection = findComponentInstance(fixture, SearchSectionComponent);

            searchSection.deleteInputDataset(failedInput.alias);

            expect(searchSection.inputsViewModel.map((item) => item.alias)).toEqual([loadedInput.alias]);
            expect([...component.inputDatasets]).toEqual([inputDatasetKey(loadedInput)]);
        });
    });

    describe("creating a new transform", () => {
        beforeEach(() => createComponent(""));

        it("should start with a single empty query", () => {
            expect(component.queries).toEqual([{ query: "" }]);
        });
    });
});
