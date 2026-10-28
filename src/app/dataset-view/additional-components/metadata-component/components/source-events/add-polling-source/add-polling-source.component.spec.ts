/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { HarnessLoader } from "@angular/cdk/testing";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ApplicationRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { from, of } from "rxjs";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ApolloTestingModule } from "apollo-angular/testing";

import { requireValue } from "@common/helpers/app.helpers";
import {
    dispatchInputEvent,
    emitClickOnElementByDataTestId,
    getElementByDataTestId,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { mockAccountDetails } from "@api/mock/auth.mock";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { FinalYamlModalComponent } from "src/app/dataset-view/additional-components/metadata-component/components/final-yaml-modal/final-yaml-modal.component";
import { ArrayKeysFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/array-keys-field/array-keys-field.harness";
import { InputFieldHarness } from "src/app/dataset-view/additional-components/metadata-component/components/form-components/input-field/input-field.harness";
import { SetPollingSourceSection } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { AddPollingSourceComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source.component";
import { StepperNavigationHarness } from "src/app/dataset-view/additional-components/metadata-component/components/stepper-navigation/stepper-navigation.harness";
import { DatasetCommitService } from "src/app/dataset-view/additional-components/overview-component/services/dataset-commit.service";
import { mockDatasetInfo } from "src/app/search/mock.data";

describe("AddPollingSourceComponent", () => {
    let component: AddPollingSourceComponent;
    let fixture: ComponentFixture<AddPollingSourceComponent>;
    let modalService: NgbModal;
    let modalRef: NgbModalRef;

    let datasetCommitService: DatasetCommitService;
    let loggedUserService: LoggedUserService;

    const MOCK_EVENT_YAML =
        'kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2025-07-31T09:14:31.436171360Z\n  prevBlockHash: f16203af1cb7aa30e9a9c12f8f76d54bf1d27f912a9f84d7938ec06b129e22977fa38\n  sequenceNumber: 13\n  event:\n    kind: SetPollingSource\n    fetch:\n      kind: Url\n      url: https://api.etherscan.io/api?module2=account&action=tokentx&address=0xeadb3840596cabf312f2bc88a4bb0b93a4e1ff5f&page=1&offset=1000&startblock=0&endblock=99999999&apikey=${{ env.ETHERSCAN_API_KEY }}\n      eventTime:\n        kind: FromMetadata\n    read:\n      kind: Json\n      subPath: result\n      dateFormat: rfc3339\n      encoding: utf8\n      timestampFormat: rfc3339\n      schema:\n      fileds: []\n    preprocess:\n      kind: Sql\n      engine: datafusion\n      queries:\n      - query: |\n          SELECT\n            to_timestamp_seconds(cast(timeStamp as bigint)) as block_time,\n            cast(blockNumber as bigint) as block_number,\n            blockHash as block_hash,\n            hash as transaction_hash,\n            transactionIndex as transaction_index,\n            nonce,\n            "from",\n            to,\n            value,\n            contractAddress as contract_address,\n            tokenName as token_name,\n            tokenSymbol as token_symbol,\n            tokenDecimal as token_decimal,\n            gas,\n            gasPrice as gas_price,\n            gasUsed as gas_used,\n            cumulativeGasUsed as cumulative_gas_used,\n            confirmations\n          FROM input\n    merge:\n      kind: Ledger\n      primaryKey:\n      - transaction_hash\n';
    const MOCK_EVENT_YAML_WITHOUT_PREPROCESS = MOCK_EVENT_YAML.replace(/ {4}preprocess:\n[\s\S]*?(?= {4}merge:\n)/, "");

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ApolloTestingModule, AddPollingSourceComponent],
            providers: [
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

        fixture = TestBed.createComponent(AddPollingSourceComponent);
        modalService = TestBed.inject(NgbModal);
        datasetCommitService = TestBed.inject(DatasetCommitService);
        loggedUserService = TestBed.inject(LoggedUserService);

        modalRef = modalService.open(FinalYamlModalComponent);
        component = fixture.componentInstance;
        component.showPreprocessStep = false;
        setComponentInput(fixture, "eventYamlByHash", MOCK_EVENT_YAML);
        component.currentStep = SetPollingSourceSection.FETCH;
        setComponentInput(fixture, "datasetInfo", mockDatasetInfo);

        vi.spyOn(loggedUserService, "currentlyLoggedInUser", "get").mockReturnValue(mockAccountDetails);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check open edit modal", () => {
        const openModalSpy = vi.spyOn(modalService, "open").mockReturnValue(modalRef);
        component.onEditYaml();
        expect(openModalSpy).toHaveBeenCalledTimes(1);
    });

    it("should check open edit modal after error", () => {
        const mockError = "Some error";
        expect(component.errorMessage).toBe("");
        expect(component.changedEventYamlByHash).toBeNull();
        datasetCommitService.emitCommitEventErrorOccurred(mockError);
        expect(component.errorMessage).toBe(mockError);

        component.onEditYaml();
        const modal = modalService.open(FinalYamlModalComponent, {
            size: "lg",
        });

        from(modal.result).subscribe(() => {
            expect(component.changedEventYamlByHash).toBeDefined();
        });
    });

    it("should check eventYamlByHash is not null", () => {
        expect(component.eventYamlByHash).toEqual(MOCK_EVENT_YAML);
    });

    it("should commit the event the form was filled from", () => {
        const submitYamlSpy = vi.spyOn(datasetCommitService, "commitEventToDataset").mockReturnValue(of());
        component.onSaveEvent();
        expect(submitYamlSpy).toHaveBeenCalledTimes(1);

        const event = requireValue(submitYamlSpy.mock.lastCall)[0].event;
        expect(event).toContain(
            "content:\n  kind: SetPollingSource\n  fetch:\n    kind: Url\n    url: https://api.etherscan.io/",
        );
        expect(event).toContain("    eventTime:\n      kind: FromMetadata\n  read:\n    kind: Json\n");
        expect(event).toContain("    subPath: result\n");
        expect(event).toContain("  merge:\n    kind: Ledger\n    primaryKey:\n      - transaction_hash\n");
        expect(event).toContain("  preprocess:\n    kind: Sql\n    engine: datafusion\n");
    });

    describe("validation", () => {
        let loader: HarnessLoader;

        beforeEach(() => {
            loader = TestbedHarnessEnvironment.loader(fixture);
        });

        async function navigation(step: "first" | "last"): Promise<StepperNavigationHarness> {
            const navigations = await loader.getAllHarnesses(StepperNavigationHarness);
            return requireValue(step === "first" ? navigations.at(0) : navigations.at(-1));
        }

        it("should keep Next disabled while the URL is not one kamu-cli fetches, and say why", async () => {
            const url = await loader.getHarness(InputFieldHarness.with({ dataTestId: "fetch-url" }));
            const fetchNavigation = await navigation("first");

            await url.setValue("example.com/data.json");
            expect(await url.getErrorMessage()).toBe(
                "Url must be a URL starting with http://, https://, ftp://, ftps://",
            );
            expect(await fetchNavigation.isNextDisabled()).toBe(true);

            await url.setValue("https://example.com/data.json");
            expect(await url.getErrorMessage()).toBeNull();
            expect(await fetchNavigation.isNextDisabled()).toBe(false);
        });

        it("should keep Save disabled while the merge strategy has no primary key", async () => {
            const url = await loader.getHarness(InputFieldHarness.with({ dataTestId: "fetch-url" }));
            await url.setValue("https://example.com/data.json");
            const primaryKey = await loader.getHarness(ArrayKeysFieldHarness.with({ dataTestId: "merge-primaryKey" }));
            const mergeNavigation = await navigation("last");
            expect(await mergeNavigation.isSaveDisabled()).toBe(false);

            await primaryKey.removeItem(0);

            expect(await mergeNavigation.isSaveDisabled()).toBe(true);
        });

        it("should save the URL the user typed", async () => {
            const commitSpy = vi.spyOn(datasetCommitService, "commitEventToDataset").mockReturnValue(of());
            const url = await loader.getHarness(InputFieldHarness.with({ dataTestId: "fetch-url" }));
            await url.setValue("https://example.com/data.json");

            const mergeNavigation = await navigation("last");
            await mergeNavigation.save();

            expect(commitSpy).toHaveBeenCalledTimes(1);
            expect(requireValue(commitSpy.mock.lastCall)[0].event).toContain(
                "    kind: Url\n    url: https://example.com/data.json\n",
            );
        });
    });

    it("should check change step", () => {
        component.changeStep(SetPollingSourceSection.READ);
        fixture.detectChanges();
        expect(component.currentStep).toBe(SetPollingSourceSection.READ);

        component.changeStep(SetPollingSourceSection.MERGE);
        fixture.detectChanges();
        expect(component.currentStep).toBe(SetPollingSourceSection.MERGE);
    });

    it("should check error message", () => {
        const errorMessage = "test error message";
        expect(component.errorMessage).toBe("");

        datasetCommitService.emitCommitEventErrorOccurred(errorMessage);
        expect(component.errorMessage).toBe(errorMessage);
    });

    it("should check change showPreprocessStep property", () => {
        expect(component.showPreprocessStep).toEqual(true);
        component.onShowPreprocessStep(false);
        expect(component.showPreprocessStep).toEqual(false);
    });

    it("should check the preprocess step is hidden when the source has none", () => {
        fixture = TestBed.createComponent(AddPollingSourceComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "eventYamlByHash", MOCK_EVENT_YAML_WITHOUT_PREPROCESS);
        component.currentStep = SetPollingSourceSection.FETCH;
        setComponentInput(fixture, "datasetInfo", mockDatasetInfo);
        component.showPreprocessStep = true;
        fixture.detectChanges();
        expect(component.showPreprocessStep).toEqual(false);
    });

    it("should focus and blur invalid fields once the view renders after a step header click", () => {
        requireValue(component.fetchForm.controls.url).setValidators(Validators.required);
        dispatchInputEvent(fixture, "fetch-url", "");
        const urlInput = getElementByDataTestId(fixture, "fetch-url");
        const blurSpy = vi.spyOn(HTMLInputElement.prototype, "blur");

        emitClickOnElementByDataTestId(fixture, "stepper-header-overlay-fetch");
        expect(blurSpy).not.toHaveBeenCalled();

        fixture.detectChanges();
        TestBed.inject(ApplicationRef).tick();
        expect(blurSpy.mock.contexts).toContain(urlInput);
    });
});
