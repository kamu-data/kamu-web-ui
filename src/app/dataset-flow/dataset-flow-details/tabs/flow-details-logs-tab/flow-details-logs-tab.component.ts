import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { LoggedUserService } from "src/app/auth/logged-user.service";

@Component({
    selector: "app-flow-details-logs-tab",
    templateUrl: "./flow-details-logs-tab.component.html",
    styleUrls: ["./flow-details-logs-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlowDetailsLogsTabComponent {
    private loggedUserService = inject(LoggedUserService);

    public get isAdmin(): boolean {
        return this.loggedUserService.isAdmin;
    }
}
