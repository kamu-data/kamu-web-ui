/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ApplicationRef } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

import { from, of } from "rxjs";

import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ApolloTestingModule } from "apollo-angular/testing";

import {
    dispatchInputEvent,
    emitClickOnElementByDataTestId,
    getElementByDataTestId,
    setComponentInput,
} from "@common/helpers/base-test.helpers.spec";
import { OdfDefaultValues } from "@common/values/app-odf-default.values";
import { mockAccountDetails } from "@api/mock/auth.mock";
import { DataSchemaField } from "@interface/dataset-schema.interface";

import { LoggedUserService } from "src/app/auth/logged-user.service";
import { FinalYamlModalComponent } from "src/app/dataset-view/additional-components/metadata-component/components/final-yaml-modal/final-yaml-modal.component";
import { mockSetPollingSourceEventYamlWithoutPreprocess } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import {
    EventTimeSourceKind,
    FetchKind,
    MergeKind,
    ReadKind,
    SetPollingSourceSection,
} from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source-form.types";
import { AddPollingSourceComponent } from "src/app/dataset-view/additional-components/metadata-component/components/source-events/add-polling-source/add-polling-source.component";
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

        component.pollingSourceForm = new FormGroup({
            fetch: new FormGroup({
                kind: new FormControl(FetchKind.URL),
                url: new FormControl(""),
                order: new FormControl("NONE"),
                eventTime: new FormGroup({
                    kind: new FormControl(EventTimeSourceKind.FROM_METADATA),
                    timestampFormat: new FormControl(""),
                }),
                cache: new FormControl(false),
                headers: new FormArray([]),
            }),
            read: new FormGroup({
                kind: new FormControl(ReadKind.CSV),
                schema: new FormControl<DataSchemaField[]>([]),
                header: new FormControl(OdfDefaultValues.CSV_HEADER),
                encoding: new FormControl(OdfDefaultValues.CSV_ENCODING),
                separator: new FormControl(OdfDefaultValues.CSV_SEPARATOR),
                quote: new FormControl(OdfDefaultValues.CSV_QUOTE),
                escape: new FormControl(OdfDefaultValues.CSV_ESCAPE),
                nullValue: new FormControl(OdfDefaultValues.CSV_NULL_VALUE),
                dateFormat: new FormControl(OdfDefaultValues.CSV_DATE_FORMAT),
                timestampFormat: new FormControl(OdfDefaultValues.CSV_TIMESTAMP_FORMAT),
                inferSchema: new FormControl(OdfDefaultValues.CSV_INFER_SCHEMA),
            }),
            merge: new FormGroup({
                kind: new FormControl(MergeKind.APPEND),
            }),
            prepare: new FormArray([]),
        });
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
        component.ngOnInit();
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check open edit modal", () => {
        component.ngOnInit();
        const openModalSpy = spyOn(modalService, "open").and.returnValue(modalRef);
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
        component.ngOnInit();
        expect(component.eventYamlByHash).toEqual(MOCK_EVENT_YAML);
    });

    it("should check submit yaml", () => {
        component.ngOnInit();
        const submitYamlSpy = spyOn(datasetCommitService, "commitEventToDataset").and.returnValue(of());
        component.onSaveEvent();
        expect(submitYamlSpy).toHaveBeenCalledTimes(1);
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
        setComponentInput(fixture, "eventYamlByHash", mockSetPollingSourceEventYamlWithoutPreprocess);
        component.ngOnInit();
        expect(component.showPreprocessStep).toEqual(false);
    });

    it("should focus and blur invalid fields once the view renders after a step header click", () => {
        component.fetchForm.controls.url.setValidators(Validators.required);
        dispatchInputEvent(fixture, "fetch-url", "");
        const urlInput = getElementByDataTestId(fixture, "fetch-url");
        const blurSpy = spyOn(HTMLInputElement.prototype, "blur").and.callThrough();

        emitClickOnElementByDataTestId(fixture, "stepper-header-overlay-fetch");
        expect(blurSpy).not.toHaveBeenCalled();

        fixture.detectChanges();
        TestBed.inject(ApplicationRef).tick();
        expect(blurSpy.calls.all().some((call) => call.object === urlInput)).toBeTrue();
    });
});
