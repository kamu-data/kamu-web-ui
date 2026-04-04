/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AsyncPipe, JsonPipe, NgIf } from "@angular/common";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
} from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";

import { Observable } from "rxjs";

import { PdfViewerModule } from "ng2-pdf-viewer";

import { DatasetBasicsFragment } from "@api/kamu.graphql.interface";
import { MaybeNull } from "@interface/app.types";

import { VersionedFileView } from "src/app/dataset-view/dataset-view.interface";

import { DatasetAsVersionedFileService } from "../../services/dataset-as-versioned-file.service";

@Component({
    selector: "app-versioned-file-view",
    imports: [
        NgIf,
        JsonPipe,
        //-----//
        MatIconModule,
        //-----//
        PdfViewerModule,
    ],
    templateUrl: "./versioned-file-view.component.html",
    styleUrl: "./versioned-file-view.component.scss",
    // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionedFileViewComponent implements OnInit {
    @Input({ required: true }) public datasetBasics: DatasetBasicsFragment;
    private _fileDetails: MaybeNull<VersionedFileView>;
    public safePdfUrl: SafeResourceUrl | undefined;

    @Input()
    set fileDetails(value: MaybeNull<VersionedFileView>) {
        console.log("-->", value);
        this._fileDetails = value;

        // if (content && type) {
        //     const rawUrl = `data:${type};base64,${content}`;
        //     // 2. Создаем безопасную ссылку
        //     this.safePdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
        // } else {
        //     this.safePdfUrl = undefined;
        // }
    }

    public get fileDetails(): MaybeNull<VersionedFileView> {
        return this._fileDetails;
    }

    private sanitizer = inject(DomSanitizer);

    public test = "";

    public fileLatestVersion = 1;

    public get safeUrl(): SafeResourceUrl {
        const rawUrl = `data:${this.fileDetails?.fileInfo.contentType};base64,${this.fileDetails?.fileInfo.content}`;
        return this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
    }

    public ngOnInit(): void {
        if (this.fileDetails) {
            console.log("!!{{}}===>", this.fileDetails);
            //this.test = this.fileDetails.fileInfo.contentUrl.url;
        }
    }
}
