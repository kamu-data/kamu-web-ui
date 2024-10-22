import { ChangeDetectionStrategy, Component, Input } from "@angular/core";
import { VerifyQueryResponse } from "../../query-explainer.types";

@Component({
    selector: "app-verify-result-section",
    templateUrl: "./verify-result-section.component.html",
    styleUrls: ["./verify-result-section.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyResultSectionComponent {
    @Input({ required: true }) public verifyResponse: VerifyQueryResponse;
}
