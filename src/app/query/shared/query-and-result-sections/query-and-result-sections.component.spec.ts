/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Clipboard } from "@angular/cdk/clipboard";
import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { MarkdownModule } from "ngx-markdown";
import { provideToastr, ToastrService } from "ngx-toastr";

import {
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    getElementByDataTestId,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockUploadPrepareResponse } from "@api/mock/upload-file.mock";
import { DatasetRequestBySql } from "@interface/dataset.interface";

import { mockSqlErrorUpdate } from "src/app/dataset-view/additional-components/data-tabs.mock";
import { EngineService } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine.service";
import { mockEngines } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { EditorModule } from "src/app/editor/editor.module";
import { QueryAndResultSectionsComponent } from "src/app/query/shared/query-and-result-sections/query-and-result-sections.component";
import { FileUploadService } from "src/app/services/file-upload.service";

describe("QueryAndResultSectionsComponent", () => {
    let component: QueryAndResultSectionsComponent;
    let fixture: ComponentFixture<QueryAndResultSectionsComponent>;
    let clipboard: Clipboard;
    let toastrService: ToastrService;
    let fileUploadService: FileUploadService;
    let engineService: EngineService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [EditorModule, SharedTestModule, QueryAndResultSectionsComponent, MarkdownModule.forRoot()],
            providers: [
                Apollo,
                provideToastr(),
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        fixture = TestBed.createComponent(QueryAndResultSectionsComponent);
        component = fixture.componentInstance;
        clipboard = TestBed.inject(Clipboard);
        toastrService = TestBed.inject(ToastrService);
        fileUploadService = TestBed.inject(FileUploadService);
        engineService = TestBed.inject(EngineService);
        spyOn(engineService, "engines").and.returnValue(of(mockEngines));

        component.sqlLoading = false;
        component.sqlRequestCode = "select * from 'mock-dataset'";
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check run sql query", () => {
        const runSQLRequestSpy = spyOn(component, "runSQLRequest");
        component.runSql(null);

        expect(runSQLRequestSpy).toHaveBeenCalledOnceWith({ query: "select * from 'mock-dataset'" }, true);
    });

    it("should check 'Run' button is disabled", () => {
        component.sqlLoading = true;
        fixture.detectChanges();
        const runButtonElem = findElementByDataTestId(fixture, "runSqlQueryButton") as HTMLButtonElement;
        expect(runButtonElem.disabled).toEqual(true);
    });

    it("should check that the progress bar for the editor disappears", fakeAsync(() => {
        component.editorLoaded = false;
        fixture.detectChanges();

        expect(component.editorLoaded).toBeFalse();
        const progressBarElementBefore = findElementByDataTestId(fixture, "editor-progress-bar");
        expect(progressBarElementBefore).toBeDefined();

        component.editorLoaded = true;
        tick();
        fixture.detectChanges();

        const progressBarElementAfter = findElementByDataTestId(fixture, "editor-progress-bar");
        expect(progressBarElementAfter).toBeUndefined();
        flush();
    }));

    it("should check invalid SQL result update", fakeAsync(() => {
        component.sqlRequestCode = "select * from 'mock-dataset'";
        component.sqlError = mockSqlErrorUpdate.error;
        tick();
        fixture.detectChanges();
        tick();
        fixture.detectChanges();
        const runSqlButton = findElementByDataTestId(fixture, "runSqlQueryButton") as HTMLButtonElement;
        const elem = getElementByDataTestId(fixture, "sql-error-message");
        expect(runSqlButton.disabled).toBe(false);
        expect(elem.textContent).toEqual(mockSqlErrorUpdate.error);
        flush();
    }));

    it("should calculate sql request params", () => {
        fixture.detectChanges();
        const sqlReq = spyOn(component.runSQLRequestEmit, "emit");
        const limit = 1;
        const params: DatasetRequestBySql = {
            query: component.sqlRequestCode,
            skip: component.currentData.length,
            limit: limit,
            enabledProof: false,
        };

        component.loadMore(limit);
        expect(sqlReq).toHaveBeenCalledWith(params);

        component.loadMore(limit);
        params.skip = component.currentData.length;

        const secondCallParams = sqlReq.calls.allArgs()[1] as DatasetRequestBySql[];
        expect(secondCallParams).toEqual([params]);
    });

    it("should check click on `Share query` button", fakeAsync(() => {
        const toastServiceSpy = spyOn(toastrService, "success");
        const clipboardCopySpy = spyOn(clipboard, "copy");
        tick();
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "shareSqlQueryButton");
        expect(toastServiceSpy).toHaveBeenCalledWith("Copied url to clipboard");
        expect(clipboardCopySpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check click on `Copy as curl command` button", () => {
        const toastServiceSpy = spyOn(toastrService, "success");
        const clipboardCopySpy = spyOn(clipboard, "copy");
        component.copyCurlCommand();
        expect(toastServiceSpy).toHaveBeenCalledWith("Copied command to clipboard");
        expect(clipboardCopySpy).toHaveBeenCalledTimes(1);
    });

    it("should check click on `Verify` button", () => {
        const uploadFilePrepareSpy = spyOn(fileUploadService, "uploadFilePrepare").and.returnValue(
            of(mockUploadPrepareResponse),
        );
        component.verifyQueryResult();
        expect(uploadFilePrepareSpy).toHaveBeenCalledTimes(1);
    });

    it("should run the query when the Generate proof' switch is enabled", () => {
        component.enabledProof = true;
        fixture.detectChanges();
        const runSQLRequestEmitSpy = spyOn(component.runSQLRequestEmit, "emit");

        component.runSQLRequest({ query: "select * from 'mock-dataset'" });
        expect(runSQLRequestEmitSpy).toHaveBeenCalledOnceWith({
            query: "select * from 'mock-dataset'",
            enabledProof: true,
        });
    });
});
