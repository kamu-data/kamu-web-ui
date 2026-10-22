/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { lastValueFrom, Observable, of, toArray } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr } from "ngx-toastr";

import { ModalService } from "@common/components/modal/modal.service";
import { FlowProcessEffectiveState } from "@api/kamu.graphql.interface";
import { ModalArgumentsInterface } from "@interface/modal.interface";

import { DatasetFlowsService } from "src/app/dataset-view/additional-components/flows-component/services/dataset-flows.service";
import { mockDatasetBasicsDerivedFragment, mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { ProcessDatasetCardInteractionService } from "src/app/services/process-dataset-card-interaction.service";

describe("ProcessDatasetCardInteractionService", () => {
    let service: ProcessDatasetCardInteractionService;
    let flowsService: DatasetFlowsService;
    let modalService: ModalService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo, provideToastr()],
        });
        service = TestBed.inject(ProcessDatasetCardInteractionService);
        flowsService = TestBed.inject(DatasetFlowsService);
        modalService = TestBed.inject(ModalService);
    });

    function answerConfirmModal(ok: boolean): jasmine.Spy {
        return spyOn(modalService, "error").and.callFake((options: ModalArgumentsInterface) => {
            options.handler?.call(undefined, ok);
            return Promise.resolve("");
        });
    }

    function emissions<T>(source$: Observable<T>): Promise<T[]> {
        return lastValueFrom(source$.pipe(toArray()));
    }

    it("should be created", () => {
        expect(service).toBeTruthy();
    });

    describe("handleTrigger", () => {
        it("should trigger an ingest flow for a root dataset and emit its success", async () => {
            const triggerIngestSpy = spyOn(flowsService, "datasetTriggerIngestFlow").and.returnValue(of(true));
            const triggerTransformSpy = spyOn(flowsService, "datasetTriggerTransformFlow");

            expect(await emissions(service.handleTrigger(mockDatasetBasicsRootFragment))).toEqual([true]);
            expect(triggerIngestSpy).toHaveBeenCalledOnceWith({ datasetId: mockDatasetBasicsRootFragment.id });
            expect(triggerTransformSpy).not.toHaveBeenCalled();
        });

        it("should trigger a transform flow for a derivative dataset", async () => {
            const triggerIngestSpy = spyOn(flowsService, "datasetTriggerIngestFlow");
            const triggerTransformSpy = spyOn(flowsService, "datasetTriggerTransformFlow").and.returnValue(of(true));

            expect(await emissions(service.handleTrigger(mockDatasetBasicsDerivedFragment))).toEqual([true]);
            expect(triggerTransformSpy).toHaveBeenCalledOnceWith({ datasetId: mockDatasetBasicsDerivedFragment.id });
            expect(triggerIngestSpy).not.toHaveBeenCalled();
        });

        it("should emit `false` when the trigger fails", async () => {
            spyOn(flowsService, "datasetTriggerIngestFlow").and.returnValue(of(false));

            expect(await emissions(service.handleTrigger(mockDatasetBasicsRootFragment))).toEqual([false]);
        });
    });

    describe("handleToggleState", () => {
        [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing].forEach((state) => {
            it(`should pause the flows for state=${state} and emit once`, async () => {
                const pauseSpy = spyOn(flowsService, "datasetPauseFlows").and.returnValue(of(void 0));
                const resumeSpy = spyOn(flowsService, "datasetResumeFlows");

                const toggled = await emissions(
                    service.handleToggleState({ state, datasetBasics: mockDatasetBasicsRootFragment }),
                );

                expect(toggled.length).toEqual(1);
                expect(pauseSpy).toHaveBeenCalledOnceWith({ datasetId: mockDatasetBasicsRootFragment.id });
                expect(resumeSpy).not.toHaveBeenCalled();
            });
        });

        it("should resume a manually paused process without asking", async () => {
            const modalSpy = spyOn(modalService, "error");
            const pauseSpy = spyOn(flowsService, "datasetPauseFlows");
            const resumeSpy = spyOn(flowsService, "datasetResumeFlows").and.returnValue(of(void 0));

            const toggled = await emissions(
                service.handleToggleState({
                    state: FlowProcessEffectiveState.PausedManual,
                    datasetBasics: mockDatasetBasicsRootFragment,
                }),
            );

            expect(toggled.length).toEqual(1);
            expect(modalSpy).not.toHaveBeenCalled();
            expect(resumeSpy).toHaveBeenCalledOnceWith({ datasetId: mockDatasetBasicsRootFragment.id });
            expect(pauseSpy).not.toHaveBeenCalled();
        });

        it("should resume an auto-stopped process once the confirmation is accepted", async () => {
            const modalSpy = answerConfirmModal(true);
            const resumeSpy = spyOn(flowsService, "datasetResumeFlows").and.returnValue(of(void 0));

            const toggled = await emissions(
                service.handleToggleState({
                    state: FlowProcessEffectiveState.StoppedAuto,
                    datasetBasics: mockDatasetBasicsRootFragment,
                }),
            );

            expect(toggled.length).toEqual(1);
            expect(modalSpy).toHaveBeenCalledTimes(1);
            expect(resumeSpy).toHaveBeenCalledTimes(1);
        });

        it("should complete without emitting when the confirmation is cancelled", async () => {
            const modalSpy = answerConfirmModal(false);
            const resumeSpy = spyOn(flowsService, "datasetResumeFlows");

            const toggled = await emissions(
                service.handleToggleState({
                    state: FlowProcessEffectiveState.StoppedAuto,
                    datasetBasics: mockDatasetBasicsRootFragment,
                }),
            );

            expect(toggled).toEqual([]);
            expect(modalSpy).toHaveBeenCalledTimes(1);
            expect(resumeSpy).not.toHaveBeenCalled();
        });

        it("should ask for confirmation only once the result is subscribed to", () => {
            const modalSpy = answerConfirmModal(true);

            service.handleToggleState({
                state: FlowProcessEffectiveState.StoppedAuto,
                datasetBasics: mockDatasetBasicsRootFragment,
            });

            expect(modalSpy).not.toHaveBeenCalled();
        });

        it("should not ask for confirmation before pausing", async () => {
            const modalSpy = spyOn(modalService, "error");
            const pauseSpy = spyOn(flowsService, "datasetPauseFlows").and.returnValue(of(void 0));

            const toggled = await emissions(
                service.handleToggleState({
                    state: FlowProcessEffectiveState.Active,
                    datasetBasics: mockDatasetBasicsRootFragment,
                }),
            );

            expect(toggled.length).toEqual(1);
            expect(modalSpy).not.toHaveBeenCalled();
            expect(pauseSpy).toHaveBeenCalledTimes(1);
        });
    });
});
