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
import type { Mock } from "vitest";

import { ModalService } from "@common/components/modal/modal.service";
import { stubMethod } from "@common/helpers/base-test.helpers.spec";
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

    function answerConfirmModal(ok: boolean): Mock {
        return vi.spyOn(modalService, "error").mockImplementation((options: ModalArgumentsInterface) => {
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
            const triggerIngestSpy = vi.spyOn(flowsService, "datasetTriggerIngestFlow").mockReturnValue(of(true));
            const triggerTransformSpy = stubMethod(flowsService, "datasetTriggerTransformFlow");

            expect(await emissions(service.handleTrigger(mockDatasetBasicsRootFragment))).toEqual([true]);
            expect(triggerIngestSpy).toHaveBeenCalledTimes(1);
            expect(triggerIngestSpy).toHaveBeenCalledWith({ datasetId: mockDatasetBasicsRootFragment.id });
            expect(triggerTransformSpy).not.toHaveBeenCalled();
        });

        it("should trigger a transform flow for a derivative dataset", async () => {
            const triggerIngestSpy = stubMethod(flowsService, "datasetTriggerIngestFlow");
            const triggerTransformSpy = vi.spyOn(flowsService, "datasetTriggerTransformFlow").mockReturnValue(of(true));

            expect(await emissions(service.handleTrigger(mockDatasetBasicsDerivedFragment))).toEqual([true]);
            expect(triggerTransformSpy).toHaveBeenCalledTimes(1);
            expect(triggerTransformSpy).toHaveBeenCalledWith({ datasetId: mockDatasetBasicsDerivedFragment.id });
            expect(triggerIngestSpy).not.toHaveBeenCalled();
        });

        it("should emit `false` when the trigger fails", async () => {
            vi.spyOn(flowsService, "datasetTriggerIngestFlow").mockReturnValue(of(false));

            expect(await emissions(service.handleTrigger(mockDatasetBasicsRootFragment))).toEqual([false]);
        });
    });

    describe("handleToggleState", () => {
        [FlowProcessEffectiveState.Active, FlowProcessEffectiveState.Failing].forEach((state) => {
            it(`should pause the flows for state=${state} and emit once`, async () => {
                const pauseSpy = vi.spyOn(flowsService, "datasetPauseFlows").mockReturnValue(of(void 0));
                const resumeSpy = stubMethod(flowsService, "datasetResumeFlows");

                const toggled = await emissions(
                    service.handleToggleState({ state, datasetBasics: mockDatasetBasicsRootFragment }),
                );

                expect(toggled.length).toEqual(1);
                expect(pauseSpy).toHaveBeenCalledTimes(1);
                expect(pauseSpy).toHaveBeenCalledWith({ datasetId: mockDatasetBasicsRootFragment.id });
                expect(resumeSpy).not.toHaveBeenCalled();
            });
        });

        [FlowProcessEffectiveState.PausedManual, FlowProcessEffectiveState.StoppedAuto].forEach((state) => {
            it(`should resume the flows for state=${state} without asking, and emit once`, async () => {
                const modalSpy = stubMethod(modalService, "error");
                const pauseSpy = stubMethod(flowsService, "datasetPauseFlows");
                const resumeSpy = vi.spyOn(flowsService, "datasetResumeFlows").mockReturnValue(of(void 0));

                const toggled = await emissions(
                    service.handleToggleState({ state, datasetBasics: mockDatasetBasicsRootFragment }),
                );

                expect(toggled.length).toEqual(1);
                expect(modalSpy).not.toHaveBeenCalled();
                expect(resumeSpy).toHaveBeenCalledTimes(1);
                expect(resumeSpy).toHaveBeenCalledWith({ datasetId: mockDatasetBasicsRootFragment.id });
                expect(pauseSpy).not.toHaveBeenCalled();
            });
        });
    });

    describe("confirmToggleState", () => {
        [
            FlowProcessEffectiveState.Active,
            FlowProcessEffectiveState.Failing,
            FlowProcessEffectiveState.PausedManual,
        ].forEach((state) => {
            it(`should let the toggle go ahead for state=${state} without asking`, async () => {
                const modalSpy = stubMethod(modalService, "error");

                expect((await emissions(service.confirmToggleState(state))).length).toEqual(1);
                expect(modalSpy).not.toHaveBeenCalled();
            });
        });

        it("should let resuming an auto-stopped process go ahead once the confirmation is accepted", async () => {
            const modalSpy = answerConfirmModal(true);

            expect((await emissions(service.confirmToggleState(FlowProcessEffectiveState.StoppedAuto))).length).toEqual(
                1,
            );
            expect(modalSpy).toHaveBeenCalledTimes(1);
        });

        it("should complete without emitting when the confirmation is cancelled", async () => {
            answerConfirmModal(false);

            expect(await emissions(service.confirmToggleState(FlowProcessEffectiveState.StoppedAuto))).toEqual([]);
        });

        it("should neither emit nor complete while the confirmation stays unanswered", () => {
            vi.spyOn(modalService, "error").mockReturnValue(Promise.resolve(""));
            const next = vi.fn();
            const complete = vi.fn();

            service.confirmToggleState(FlowProcessEffectiveState.StoppedAuto).subscribe({ next, complete });

            expect(next).not.toHaveBeenCalled();
            expect(complete).not.toHaveBeenCalled();
        });

        it("should ask for confirmation only once the result is subscribed to", () => {
            const modalSpy = answerConfirmModal(true);

            service.confirmToggleState(FlowProcessEffectiveState.StoppedAuto);

            expect(modalSpy).not.toHaveBeenCalled();
        });
    });
});
