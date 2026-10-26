/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient } from "@angular/common/http";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { provideToastr, ToastrService } from "ngx-toastr";

import { setComponentInput, stubMethod } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { DatasetViewTypeEnum, VersionedFileView } from "src/app/dataset-view/dataset-view.interface";
import {
    MOCK_VERSIONED_FILE_NAME,
    mockDatasetAsVersionedFileQuery,
    mockDatasetBasicsRootFragment,
    mockVersionedFileEntryLatest,
} from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";

import { DatasetAsVersionedFileService } from "../../services/dataset-as-versioned-file.service";
import { VersionedFileViewComponent } from "./versioned-file-view.component";

describe("VersionedFileViewComponent", () => {
    let component: VersionedFileViewComponent;
    let fixture: ComponentFixture<VersionedFileViewComponent>;
    let datasetAsVersionedFileService: DatasetAsVersionedFileService;
    let toastrService: ToastrService;
    let navigationService: NavigationService;

    const MOCK_VERSIONED_VIEW_FILE: VersionedFileView = {
        name: MOCK_VERSIONED_FILE_NAME,
        fileInfo: mockVersionedFileEntryLatest,
        countVersions: mockDatasetAsVersionedFileQuery.datasets.byId?.asVersionedFile?.versions.totalCount,
    };

    function setMockObjectByContentType(contentType: string): VersionedFileView {
        return Object.assign({}, MOCK_VERSIONED_VIEW_FILE, {
            fileInfo: {
                ...mockVersionedFileEntryLatest,
                contentType,
            },
        });
    }

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [VersionedFileViewComponent, SharedTestModule],
            providers: [Apollo, provideToastr(), provideHttpClient()],
        }).compileComponents();

        datasetAsVersionedFileService = TestBed.inject(DatasetAsVersionedFileService);
        navigationService = TestBed.inject(NavigationService);
        toastrService = TestBed.inject(ToastrService);
        fixture = TestBed.createComponent(VersionedFileViewComponent);
        component = fixture.componentInstance;
        setComponentInput(fixture, "datasetBasics", mockDatasetBasicsRootFragment);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check ngOnInit", () => {
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("text/plain");
        const requestDatasetAsVersionedFileSpy = vi
            .spyOn(datasetAsVersionedFileService, "requestDatasetAsVersionedFile")
            .mockReturnValue(of(mockVersionedFileView));
        vi.spyOn(component, "setPreviewFileStrategy").mockReturnValue(Promise.resolve());

        component.version$.next(0);
        fixture.detectChanges();

        expect(requestDatasetAsVersionedFileSpy).toHaveBeenCalledTimes(1);
    });

    it("should check ngOnInit with version", () => {
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("text/plain");
        const requestDatasetAsVersionedFileSpy = vi
            .spyOn(datasetAsVersionedFileService, "requestDatasetAsVersionedFile")
            .mockReturnValue(of(mockVersionedFileView));
        const requestDatasetAsVersionedFileByVersionSpy = vi
            .spyOn(datasetAsVersionedFileService, "requestDatasetAsVersionedFileByVersion")
            .mockReturnValue(of(mockVersionedFileView));
        vi.spyOn(component, "setPreviewFileStrategy").mockReturnValue(Promise.resolve());

        component.version$.next(2);
        fixture.detectChanges();

        expect(requestDatasetAsVersionedFileByVersionSpy).toHaveBeenCalledTimes(1);
        expect(requestDatasetAsVersionedFileSpy).not.toHaveBeenCalled();
    });

    it("should check setPreviewFileStrategy method for pdf file", async () => {
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("application/pdf");
        await component.setPreviewFileStrategy(mockVersionedFileView);

        expect(component.urlContentPath).toEqual(mockVersionedFileEntryLatest.contentUrl.url);
    });

    it("should check setPreviewFileStrategy method for text file", async () => {
        const requestFileAsTextSpy = stubMethod(datasetAsVersionedFileService, "requestFileAsText");
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
        const requestFileAsJsonSpy = stubMethod(datasetAsVersionedFileService, "requestFileAsJson");
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("application/json");
        if (mockVersionedFileView.fileInfo) {
            await component.setPreviewFileStrategy(mockVersionedFileView);

            expect(requestFileAsJsonSpy).toHaveBeenCalledTimes(1);
        }
    });

    it("should check setPreviewFileStrategy method for unspported file", async () => {
        const toastrServiceInfoSpy = stubMethod(toastrService, "info");
        const mockVersionedFileView: VersionedFileView = setMockObjectByContentType("unsupported/type");

        if (mockVersionedFileView.fileInfo) {
            await component.setPreviewFileStrategy(mockVersionedFileView);

            expect(toastrServiceInfoSpy).toHaveBeenCalledWith("Content type not supported: unsupported/type");
        }
    });

    it("should check redirecr to latest version", () => {
        const navigateToDatasetViewSpy = vi.spyOn(navigationService, "navigateToDatasetView").mockReturnValue();
        component.goToLatestVersionedFile();
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(
            expect.objectContaining({
                tab: DatasetViewTypeEnum.Overview,
            }),
        );
    });

    it("should check is latest version", () => {
        const result = component.isLatestVersion(MOCK_VERSIONED_VIEW_FILE);
        expect(result).toEqual(true);
    });

    it("should check dowmload file", () => {
        const downloadFileSpy = vi.spyOn(datasetAsVersionedFileService, "downloadFile").mockImplementation(() => {});
        component.downloadFile(MOCK_VERSIONED_VIEW_FILE);
        expect(downloadFileSpy).toHaveBeenCalledTimes(1);
    });
});
