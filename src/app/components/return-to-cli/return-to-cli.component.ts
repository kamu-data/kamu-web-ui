import { ChangeDetectionStrategy, Component } from "@angular/core";
import AppValues from "src/app/common/app.values";

@Component({
    selector: "app-return-to-cli",
    templateUrl: "./return-to-cli.component.html",
    styleUrls: ["./return-to-cli.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnToCliComponent {
    public readonly APP_LOGO = `/${AppValues.APP_LOGO}`;
}
