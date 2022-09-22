import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-account",
    templateUrl: "./account.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountComponent {}
