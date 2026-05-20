/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, DatePipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { Observable } from "rxjs";

import { DisplayHashComponent } from "@common/components/display-hash/display-hash.component";
import { DisplaySizePipe } from "@common/pipes/display-size.pipe";
import AppValues from "@common/values/app.values";
import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";

import { DatasetViewTypeEnum, VersionedFileView } from "src/app/dataset-view/dataset-view.interface";
import ProjectLinks from "src/app/project-links";
import { NavigationService } from "src/app/services/navigation.service";

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
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    public fileInfo$: Observable<VersionedFileView>;
    @Input({ required: true }) public version: number;

    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;
    private datasetAsVersionedFileService = inject(DatasetAsVersionedFileService);
    private navigationService = inject(NavigationService);

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

    public setVersion(fileDetails: VersionedFileView, step: number): void {
        this.navigationService.navigateToDatasetView({
            accountName: this.datasetBasics.owner.accountName,
            datasetName: this.datasetBasics.name,
            tab: DatasetViewTypeEnum.Overview,
            [ProjectLinks.URL_QUERY_PARAM_VERSION]: this.currentFileVersion(fileDetails) + step,
        });
    }
}
