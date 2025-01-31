import { ChangeDetectionStrategy, Component, inject, Input } from "@angular/core";
import { VerifyQueryError, VerifyQueryKindError } from "../../query-explainer.types";
import { Clipboard } from "@angular/cdk/clipboard";
import { changeCopyIcon } from "src/app/common/app.helpers";
import { MaybeUndefined } from "src/app/common/app.types";
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

    /* istanbul ignore next */
    public copyToClipboard(event: MouseEvent, text: string): void {
        this.clipboard.copy(text);
        changeCopyIcon(event);
    }

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
