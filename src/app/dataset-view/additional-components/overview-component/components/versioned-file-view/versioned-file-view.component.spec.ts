/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { SimpleChanges } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of, tap } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { SharedTestModule } from "@common/modules/shared-test.module";
import { VersionedFileEntryDataFragment } from "@api/kamu.graphql.interface";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";
import { mockDatasetAsVersionedFileQuery, mockDatasetBasicsRootFragment } from "src/app/search/mock.data";

import { DatasetAsVersionedFileService } from "../../services/dataset-as-versioned-file.service";
import { VersionedFileViewComponent } from "./versioned-file-view.component";

describe("VersionedFileViewComponent", () => {
    let component: VersionedFileViewComponent;
    let fixture: ComponentFixture<VersionedFileViewComponent>;
    let datasetAsVersionedFileService: DatasetAsVersionedFileService;
    let toastrService: ToastrService;

    const MOCK_VERSIONED_VIEW_FILE: VersionedFileView = {
        name: mockDatasetAsVersionedFileQuery.datasets.byId?.name as string,
        fileInfo: mockDatasetAsVersionedFileQuery.datasets.byId?.asVersionedFile
            ?.latest as VersionedFileEntryDataFragment,
        countVersions: mockDatasetAsVersionedFileQuery.datasets.byId?.asVersionedFile?.versions.totalCount as number,
    };

    function setMockObjectByContentType(contentType: string): VersionedFileView {
        return Object.assign({}, MOCK_VERSIONED_VIEW_FILE, {
            fileInfo: {
                ...(mockDatasetAsVersionedFileQuery.datasets.byId?.asVersionedFile
                    ?.latest as VersionedFileEntryDataFragment),
                contentType,
            },
        });
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VersionedFileViewComponent, SharedTestModule],
            providers: [Apollo, provideToastr(), provideHttpClient(withInterceptorsFromDi())],
        }).compileComponents();

        datasetAsVersionedFileService = TestBed.inject(DatasetAsVersionedFileService);
        toastrService = TestBed.inject(ToastrService);
        fixture = TestBed.createComponent(VersionedFileViewComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        spyOnProperty(datasetAsVersionedFileService, "selectFileVersionChanges", "get").and.returnValue(of(2));
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check ngOnChanges", () => {
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("text/plain");
        const requestDatasetAsVersionedFileSpy = spyOn(
            datasetAsVersionedFileService,
            "requestDatasetAsVersionedFile",
        ).and.returnValue(of(mockVersionedFileView).pipe(tap()));
        spyOn(component, "setPreviewFileStrategy").and.returnValue(Promise.resolve());
        const datasetBasicsSimpleChanges: SimpleChanges = {
            datasetBasics: {
                previousValue: undefined,
                currentValue: mockDatasetBasicsRootFragment,
                firstChange: true,
                isFirstChange: () => true,
            },
        };
        component.ngOnChanges(datasetBasicsSimpleChanges);
        expect(requestDatasetAsVersionedFileSpy).toHaveBeenCalledTimes(1);
    });

    it("should check setPreviewFileStrategy method for pdf file", async () => {
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("application/pdf");
        await component.setPreviewFileStrategy(mockVersionedFileView);

        expect(component.urlContentPath).toEqual(
            mockDatasetAsVersionedFileQuery.datasets.byId?.asVersionedFile?.latest?.contentUrl.url as string,
        );
    });

    it("should check setPreviewFileStrategy method for text file", async () => {
        const requestFileAsTextSpy = spyOn(datasetAsVersionedFileService, "requestFileAsText");
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("text/plain");
        if (mockVersionedFileView.fileInfo) {
            await component.setPreviewFileStrategy(mockVersionedFileView);

            expect(requestFileAsTextSpy).toHaveBeenCalledTimes(1);
        }
    });

    it("should check setPreviewFileStrategy method for video file", async () => {
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("video/mp4");
        if (mockVersionedFileView.fileInfo) {
            await component.setPreviewFileStrategy(mockVersionedFileView);

            expect(component.urlContentPath).toBeDefined();
        }
    });

    it("should check setPreviewFileStrategy method for json file", async () => {
        const requestFileAsJsonSpy = spyOn(datasetAsVersionedFileService, "requestFileAsJson");
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("application/json");
        if (mockVersionedFileView.fileInfo) {
            await component.setPreviewFileStrategy(mockVersionedFileView);

            expect(requestFileAsJsonSpy).toHaveBeenCalledTimes(1);
        }
    });

    it("should check setPreviewFileStrategy method for unspported file", async () => {
        const toastrServiceInfoSpy = spyOn(toastrService, "info");
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("unsupported/type");

        if (mockVersionedFileView.fileInfo) {
            await component.setPreviewFileStrategy(mockVersionedFileView);

            expect(toastrServiceInfoSpy).toHaveBeenCalledWith("Content type not supported: unsupported/type");
        }
    });

    it("should check redirecr to latest version", () => {
        const requestDatasetAsVersionedFileSpy = spyOn(
            datasetAsVersionedFileService,
            "requestDatasetAsVersionedFile",
        ).and.returnValue(of().pipe(tap()));

        component.goToLatestVersionedFile();
        expect(requestDatasetAsVersionedFileSpy).toHaveBeenCalledTimes(1);
    });

    it("should check is latest version", () => {
        const result = component.isLatestVersion(MOCK_VERSIONED_VIEW_FILE);
        expect(result).toEqual(true);
    });

    it("should check dowmload file", () => {
        const downloadFileSpy = spyOn(datasetAsVersionedFileService, "downloadFile");
        component.downloadFile(MOCK_VERSIONED_VIEW_FILE);
        expect(downloadFileSpy).toHaveBeenCalledTimes(1);
    });
});
