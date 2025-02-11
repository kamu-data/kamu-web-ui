import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminDashboardComponent } from "./admin-dashboard/admin-dashboard.component";

@NgModule({
    declarations: [AdminDashboardComponent],
    exports: [AdminDashboardComponent],
    imports: [CommonModule],
})
export class AdminViewModule {}
