import { ChangeDetectionStrategy, Component } from "@angular/core";

@Component({
    selector: "app-admin-dashboard",
    templateUrl: "./admin-dashboard.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent {}
