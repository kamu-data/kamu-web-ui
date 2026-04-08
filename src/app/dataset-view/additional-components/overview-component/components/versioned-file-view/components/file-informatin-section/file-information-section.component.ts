/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { NgIf } from "@angular/common";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { DisplayHashComponent } from "@common/components/display-hash/display-hash.component";
import { DisplaySizePipe } from "@common/pipes/display-size.pipe";
import { MaybeNull } from "@interface/app.types";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";

@Component({
    selector: "app-file-information-section",
    imports: [NgIf, MatIconModule, DisplaySizePipe, DisplayHashComponent],
    standalone: true,
    templateUrl: "./file-information-section.component.html",
    // styleUrl: "./file-information-section.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileInformationSectionComponent {
    private _fileDetails: MaybeNull<VersionedFileView>;

    @Input({ required: true })
    set fileInfo(value: MaybeNull<VersionedFileView>) {
        this._fileDetails = value;
    }

    public get fileDetails(): MaybeNull<VersionedFileView> {
        return this._fileDetails;
    }
}
