/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { DatePipe, NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { DisplayHashComponent } from "@common/components/display-hash/display-hash.component";
import { DisplaySizePipe } from "@common/pipes/display-size.pipe";
import AppValues from "@common/values/app.values";
import { MaybeNull } from "@interface/app.types";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-file-information-section",
    imports: [
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
export class FileInformationSectionComponent {
    @Input({ required: true })
    public set fileInfo(value: MaybeNull<VersionedFileView>) {
        this._fileDetails = value;
    }
    @Output() public changeFileVersionEmitter = new EventEmitter<number>();

    private _fileDetails: MaybeNull<VersionedFileView>;
    public readonly DISPLAY_TIME_FORMAT = AppValues.DISPLAY_TIME_FORMAT;

    public get fileDetails(): MaybeNull<VersionedFileView> {
        return this._fileDetails;
    }

    public get currentFileVersion(): number {
        return Number(this.fileDetails?.fileInfo?.version);
    }

    public get nextVersionBtnDisabled(): boolean {
        return this.currentFileVersion >= Number(this.fileDetails?.countVersions);
    }

    public get previousVersionBtnDisabled(): boolean {
        return this.currentFileVersion <= 1;
    }

    public setVersion(version: number): void {
        this.changeFileVersionEmitter.emit(version);
    }
}
