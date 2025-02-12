import { MaybeNull, MaybeUndefined } from "src/app/interface/app.types";
import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import {
    VerifyQueryError,
    VerifyQueryKindError,
    VerifyQueryOutputMismatchError,
    VerifyQueryResponse,
} from "../../query-explainer.types";

@Component({
    selector: "app-verify-result-section",
    templateUrl: "./verify-result-section.component.html",
    styleUrls: ["./verify-result-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
