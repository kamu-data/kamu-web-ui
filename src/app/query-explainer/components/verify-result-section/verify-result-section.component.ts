/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
    VerifyQueryError,
    VerifyQueryKindError,
    VerifyQueryOutputMismatchError,
    VerifyQueryResponse,
} from "../../query-explainer.types";
import { MatIconModule } from "@angular/material/icon";
import { NgIf } from "@angular/common";

@Component({
    selector: "app-verify-result-section",
    templateUrl: "./verify-result-section.component.html",
    styleUrls: ["./verify-result-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        NgIf,
        //-----//
        MatIconModule,
    ],
})
export class VerifyResultSectionComponent {
    @Input({ required: true }) public verifyResponse: MaybeNull<VerifyQueryResponse>;

    public isOutputMismatchError(error: MaybeUndefined<VerifyQueryError>): boolean {
        return error?.kind === VerifyQueryKindError.OutputMismatch;
    }

    public outputMismatchError(error: MaybeUndefined<VerifyQueryError>): VerifyQueryOutputMismatchError {
        return error as VerifyQueryOutputMismatchError;
    }
}
