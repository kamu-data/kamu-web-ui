import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { QueryAndResultSectionsComponent } from "./query-and-result-sections.component";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { MatMenuModule } from "@angular/material/menu";
import { RequestTimerComponent } from "../request-timer/request-timer.component";
import { SqlEditorComponent } from "src/app/shared/editor/components/sql-editor/sql-editor.component";
import { EditorModule } from "src/app/shared/editor/editor.module";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from "@angular/material/icon";
import { SharedTestModule } from "src/app/common/shared-test.module";
import {
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
    getElementByDataTestId,
} from "src/app/common/base-test.helpers.spec";
import { mockSqlErrorUpdate } from "../../../dataset-view/additional-components/data-tabs.mock";
import { Clipboard } from "@angular/cdk/clipboard";
import { QueryExplainerService } from "src/app/query-explainer/query-explainer.service";
import { of } from "rxjs";
import { mockUploadPrepareResponse } from "src/app/api/mock/upload-file.mock";
import { mockQueryExplainerResponse } from "src/app/query-explainer/query-explainer.mocks";
import { FileUploadService } from "src/app/services/file-upload.service";
import { MatDividerModule } from "@angular/material/divider";

describe("QueryAndResultSectionsComponent", () => {
    let component: QueryAndResultSectionsComponent;
    let fixture: ComponentFixture<QueryAndResultSectionsComponent>;
    let clipboard: Clipboard;
    let toastrService: ToastrService;
    let queryExplainerService: QueryExplainerService;
    let fileUploadService: FileUploadService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [QueryAndResultSectionsComponent, RequestTimerComponent, SqlEditorComponent],
            imports: [
                CdkAccordionModule,
                HttpClientTestingModule,
                ToastrModule.forRoot(),
                MatMenuModule,
                MatProgressBarModule,
                EditorModule,
                MatIconModule,
                SharedTestModule,
                MatDividerModule,
            ],
            providers: [Apollo],
        });
        fixture = TestBed.createComponent(QueryAndResultSectionsComponent);
        component = fixture.componentInstance;
        clipboard = TestBed.inject(Clipboard);
        toastrService = TestBed.inject(ToastrService);
        queryExplainerService = TestBed.inject(QueryExplainerService);
        fileUploadService = TestBed.inject(FileUploadService);
        component.sqlLoading = false;
        component.sqlRequestCode = "select * from 'mock-dataset'";
    });

    it("should create", () => {
        expect(component).toBeTruthy();
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
        const params = {
            query: component.sqlRequestCode,
            skip: component.currentData.length,
            limit: limit,
        };

        component.loadMore(limit);
        expect(sqlReq).toHaveBeenCalledWith(params);

        component.loadMore(limit);
        params.skip = component.currentData.length;

        const secondCallParams = sqlReq.calls.allArgs()[1];
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

    it("should check click on `Verify query result` button", () => {
        const processQuerySpy = spyOn(queryExplainerService, "processQueryWithProof").and.returnValue(
            of(mockQueryExplainerResponse),
        );
        const uploadFilePrepareSpy = spyOn(fileUploadService, "uploadFilePrepare").and.returnValue(
            of(mockUploadPrepareResponse),
        );
        component.verifyQueryResult();
        expect(processQuerySpy).toHaveBeenCalledTimes(1);
        expect(uploadFilePrepareSpy).toHaveBeenCalledTimes(1);
    });
});
