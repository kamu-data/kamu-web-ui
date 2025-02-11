import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppHeaderComponent } from "./app-header/app-header.component";
import { NotificationIndicatorComponent } from "./notification-indicator/notification-indicator.component";
import { RouterModule } from "@angular/router";
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from "@angular/material/icon";
import { HighlightModule } from "ngx-highlightjs";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";

@NgModule({
    declarations: [AppHeaderComponent, NotificationIndicatorComponent],
    exports: [AppHeaderComponent],
    imports: [
        CommonModule,
        FormsModule,
        HighlightModule,
        MatMenuModule,
        MatIconModule,
        MatProgressSpinnerModule,
        NgbTypeaheadModule,
        RouterModule,
    ],
})
export class HeaderModule {}
