/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { fakeAsync, TestBed, tick } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { ModalService } from "@common/components/modal/modal.service";
import AppValues from "@common/values/app.values";
import { FlowProcessEffectiveState } from "@api/kamu.graphql.interface";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { mockDatasetBasicsDerivedFragment, mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { ProcessDatasetCardInteractionService } from "src/app/services/process-dataset-card-interaction.service";

describe("ProcessDatasetCardInteractionService", () => {
    let service: ProcessDatasetCardInteractionService;
    let flowsService: DatasetFlowsService;
    let modalService: ModalService;
    let onSuccessSpy: jasmine.Spy;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
        });
        service = TestBed.inject(ProcessDatasetCardInteractionService);
        flowsService = TestBed.inject(DatasetFlowsService);
        modalService = TestBed.inject(ModalService);
        onSuccessSpy = jasmine.createSpy("onSuccess");
    });

    function answerConfirmModal(ok: boolean): jasmine.Spy {
        return spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, ok);
            return Promise.resolve("");
        });
    }

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    describe("handleTrigger", () => {
        it("should trigger an ingest flow for a root dataset and report success after the delay", fakeAsync(() => {
            const triggerIngestSpy = spyOn(flowsService, "datasetTriggerIngestFlow").and.returnValue(of(true));
            const triggerTransformSpy = spyOn(flowsService, "datasetTriggerTransformFlow");

            service.handleTrigger(mockDatasetBasicsRootFragment, onSuccessSpy);

            expect(triggerIngestSpy).toHaveBeenCalledOnceWith({ datasetId: mockDatasetBasicsRootFragment.id });
            expect(triggerTransformSpy).not.toHaveBeenCalled();
            tick(AppValues.TIMEOUT_REFRESH_FLOW_MS - 1);
            expect(onSuccessSpy).not.toHaveBeenCalled();
            tick(1);
            expect(onSuccessSpy).toHaveBeenCalledTimes(1);
        }));

        it("should trigger a transform flow for a derivative dataset", fakeAsync(() => {
            const triggerIngestSpy = spyOn(flowsService, "datasetTriggerIngestFlow");
            const triggerTransformSpy = spyOn(flowsService, "datasetTriggerTransformFlow").and.returnValue(of(true));

            service.handleTrigger(mockDatasetBasicsDerivedFragment, onSuccessSpy);
            tick(AppValues.TIMEOUT_REFRESH_FLOW_MS);

            expect(triggerTransformSpy).toHaveBeenCalledOnceWith({ datasetId: mockDatasetBasicsDerivedFragment.id });
            expect(triggerIngestSpy).not.toHaveBeenCalled();
            expect(onSuccessSpy).toHaveBeenCalledTimes(1);
        }));

        it("should not report success when the trigger fails", fakeAsync(() => {
            spyOn(flowsService, "datasetTriggerIngestFlow").and.returnValue(of(false));

            service.handleTrigger(mockDatasetBasicsRootFragment, onSuccessSpy);
            tick(AppValues.TIMEOUT_REFRESH_FLOW_MS);

            expect(onSuccessSpy).not.toHaveBeenCalled();
        }));
    });

    describe("handleToggleState", () => {
        [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing].forEach((state) => {
            it(`should pause the flows for state=${state} and report success after the delay`, fakeAsync(() => {
                const pauseSpy = spyOn(flowsService, "datasetPauseFlows").and.returnValue(of(void 0));
                const resumeSpy = spyOn(flowsService, "datasetResumeFlows");

                service.handleToggleState({
                    state,
                    datasetBasics: mockDatasetBasicsRootFragment,
                    onSuccess: onSuccessSpy,
                });

                expect(pauseSpy).toHaveBeenCalledOnceWith({ datasetId: mockDatasetBasicsRootFragment.id });
                expect(resumeSpy).not.toHaveBeenCalled();
                tick(AppValues.TIMEOUT_REFRESH_FLOW_MS - 1);
                expect(onSuccessSpy).not.toHaveBeenCalled();
                tick(1);
                expect(onSuccessSpy).toHaveBeenCalledTimes(1);
            }));
        });

        [FlowProcessEffectiveState.PausedManual, FlowProcessEffectiveState.StoppedAuto].forEach((state) => {
            it(`should resume the flows for state=${state} without asking when no confirmation is requested`, fakeAsync(() => {
                const modalSpy = spyOn(modalService, "error");
                const pauseSpy = spyOn(flowsService, "datasetPauseFlows");
                const resumeSpy = spyOn(flowsService, "datasetResumeFlows").and.returnValue(of(void 0));

                service.handleToggleState({
                    state,
                    datasetBasics: mockDatasetBasicsRootFragment,
                    onSuccess: onSuccessSpy,
                });
                tick(AppValues.TIMEOUT_REFRESH_FLOW_MS);

                expect(modalSpy).not.toHaveBeenCalled();
                expect(resumeSpy).toHaveBeenCalledOnceWith({ datasetId: mockDatasetBasicsRootFragment.id });
                expect(pauseSpy).not.toHaveBeenCalled();
                expect(onSuccessSpy).toHaveBeenCalledTimes(1);
            }));
        });

        it("should resume an auto-stopped process once the confirmation is accepted", fakeAsync(() => {
            const modalSpy = answerConfirmModal(true);
            const resumeSpy = spyOn(flowsService, "datasetResumeFlows").and.returnValue(of(void 0));

            service.handleToggleState({
                state: FlowProcessEffectiveState.StoppedAuto,
                datasetBasics: mockDatasetBasicsRootFragment,
                onSuccess: onSuccessSpy,
                confirmModal: true,
            });
            tick(AppValues.TIMEOUT_REFRESH_FLOW_MS);

            expect(modalSpy).toHaveBeenCalledTimes(1);
            expect(resumeSpy).toHaveBeenCalledTimes(1);
            expect(onSuccessSpy).toHaveBeenCalledTimes(1);
        }));

        it("should leave an auto-stopped process alone when the confirmation is cancelled", fakeAsync(() => {
            const modalSpy = answerConfirmModal(false);
            const resumeSpy = spyOn(flowsService, "datasetResumeFlows");

            service.handleToggleState({
                state: FlowProcessEffectiveState.StoppedAuto,
                datasetBasics: mockDatasetBasicsRootFragment,
                onSuccess: onSuccessSpy,
                confirmModal: true,
            });
            tick(AppValues.TIMEOUT_REFRESH_FLOW_MS);

            expect(modalSpy).toHaveBeenCalledTimes(1);
            expect(resumeSpy).not.toHaveBeenCalled();
            expect(onSuccessSpy).not.toHaveBeenCalled();
        }));

        it("should not ask for confirmation before pausing, even when confirmation is requested", fakeAsync(() => {
            const modalSpy = spyOn(modalService, "error");
            const pauseSpy = spyOn(flowsService, "datasetPauseFlows").and.returnValue(of(void 0));

            service.handleToggleState({
                state: FlowProcessEffectiveState.Active,
                datasetBasics: mockDatasetBasicsRootFragment,
                onSuccess: onSuccessSpy,
                confirmModal: true,
            });
            tick(AppValues.TIMEOUT_REFRESH_FLOW_MS);

            expect(modalSpy).not.toHaveBeenCalled();
            expect(pauseSpy).toHaveBeenCalledTimes(1);
            expect(onSuccessSpy).toHaveBeenCalledTimes(1);
        }));
    });
});
