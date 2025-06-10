/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { VerifyQueryError, VerifyQueryKindError } from "../../query-explainer.types";
import { Clipboard } from "@angular/cdk/clipboard";
import { MaybeUndefined } from "src/app/interface/app.types";
import { QueryExplainerComponentData } from "../../query-explainer.component";
@Component({
    selector: "app-commitment-data-section",
    templateUrl: "./commitment-data-section.component.html",
    styleUrls: ["./commitment-data-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommitmentDataSectionComponent {
    private clipboard = inject(Clipboard);
    @Input({ required: true }) public commitmentData: QueryExplainerComponentData;

    public isInputHashError(error: MaybeUndefined<VerifyQueryError>): boolean {
        return error?.kind === VerifyQueryKindError.InputHash;
    }

    public isSubQueriesHashError(error: MaybeUndefined<VerifyQueryError>): boolean {
        return error?.kind === VerifyQueryKindError.SubQueriesHash;
    }

    public isBadSignatureError(error: MaybeUndefined<VerifyQueryError>): boolean {
        return error?.kind === VerifyQueryKindError.BadSignature;
    }

    public isOutputMismatchError(error: MaybeUndefined<VerifyQueryError>): boolean {
        return error?.kind === VerifyQueryKindError.OutputMismatch;
    }
}
