/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, DatePipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { Observable } from "rxjs";

import { DisplayHashComponent } from "@common/components/display-hash/display-hash.component";
import { DisplaySizePipe } from "@common/pipes/display-size.pipe";
import AppValues from "@common/values/app.values";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";

import { DatasetAsVersionedFileService } from "../../../../services/dataset-as-versioned-file.service";

@Component({
    selector: "app-file-information-section",
    imports: [
        AsyncPipe,
        NgIf,
        DatePipe,
        //-----//
        MatIconModule,
        //-----//,
        DisplayHashComponent,
        DisplaySizePipe,
    ],
    templateUrl: "./file-information-section.component.html",
    styleUrl: "./file-information-section.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInformationSectionComponent implements OnInit {
    public fileInfo$: Observable<VersionedFileView>;

    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;
    private datasetAsVersionedFileService = inject(DatasetAsVersionedFileService);

    public ngOnInit(): void {
        this.fileInfo$ = this.datasetAsVersionedFileService.versionedFileDetailsChanges;
    }

    public currentFileVersion(fileDetails: VersionedFileView): number {
        return Number(fileDetails?.fileInfo?.version);
    }

    public nextVersionBtnDisabled(fileDetails: VersionedFileView): boolean {
        const noFileInfo = !fileDetails?.fileInfo;
        return noFileInfo || this.currentFileVersion(fileDetails) >= Number(fileDetails?.countVersions);
    }

    public previousVersionBtnDisabled(fileDetails: VersionedFileView): boolean {
        const noFileInfo = !fileDetails?.fileInfo;
        return noFileInfo || this.currentFileVersion(fileDetails) <= 1;
    }

    public setPreviousVersion(fileDetails: VersionedFileView): void {
        this.datasetAsVersionedFileService.emitSelectFileVersionChanged(this.currentFileVersion(fileDetails) - 1);
    }

    public setNextVersion(fileDetails: VersionedFileView): void {
        this.datasetAsVersionedFileService.emitSelectFileVersionChanged(this.currentFileVersion(fileDetails) + 1);
    }
}
