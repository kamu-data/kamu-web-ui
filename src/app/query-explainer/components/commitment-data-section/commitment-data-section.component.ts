/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Clipboard } from "@angular/cdk/clipboard";
import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";

import { CopyToClipboardComponent } from "@common/components/copy-to-clipboard/copy-to-clipboard.component";
import { MaybeNull } from "@interface/app.types";

import { QueryExplainerComponentData } from "src/app/query-explainer/query-explainer.component";
import { VerifyQueryError, VerifyQueryKindError } from "src/app/query-explainer/query-explainer.types";

@Component({
    selector: "app-commitment-data-section",
    templateUrl: "./commitment-data-section.component.html",
    styleUrls: ["./commitment-data-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        CopyToClipboardComponent,
    ],
})
export class CommitmentDataSectionComponent {
    private clipboard = inject(Clipboard);
    @Input({ required: true }) public commitmentData: QueryExplainerComponentData;

    public get verifyError(): MaybeNull<VerifyQueryError> {
        const response = this.commitmentData.sqlQueryVerify;
        return response?.ok === false ? response.error : null;
    }

    public isInputHashError(error: MaybeNull<VerifyQueryError>): boolean {
        return error?.kind === VerifyQueryKindError.InputHash;
    }

    public isSubQueriesHashError(error: MaybeNull<VerifyQueryError>): boolean {
        return error?.kind === VerifyQueryKindError.SubQueriesHash;
    }

    public isBadSignatureError(error: MaybeNull<VerifyQueryError>): boolean {
        return error?.kind === VerifyQueryKindError.BadSignature;
    }

    public isOutputMismatchError(error: MaybeNull<VerifyQueryError>): boolean {
        return error?.kind === VerifyQueryKindError.OutputMismatch;
    }
}
