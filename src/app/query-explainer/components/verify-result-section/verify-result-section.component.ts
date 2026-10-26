/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

import { MaybeNull } from "@interface/app.types";

import {
    VerifyQueryError,
    VerifyQueryKindError,
    VerifyQueryOutputMismatchError,
    VerifyQueryResponse,
} from "src/app/query-explainer/query-explainer.types";

@Component({
    selector: "app-verify-result-section",
    templateUrl: "./verify-result-section.component.html",
    styleUrls: ["./verify-result-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        //-----//
        MatIconModule,
    ],
})
export class VerifyResultSectionComponent {
    @Input({ required: true }) public verifyResponse: MaybeNull<VerifyQueryResponse>;

    public get verifyError(): MaybeNull<VerifyQueryError> {
        return this.verifyResponse?.ok === false ? this.verifyResponse.error : null;
    }

    public get outputMismatchError(): MaybeNull<VerifyQueryOutputMismatchError> {
        const error = this.verifyError;
        return error?.kind === VerifyQueryKindError.OutputMismatch ? error : null;
    }
}
