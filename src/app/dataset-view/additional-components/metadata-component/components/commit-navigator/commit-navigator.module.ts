import { NgModule } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { MatChipsModule } from "@angular/material/chips";
import { MatDividerModule } from "@angular/material/divider";
import { CommitNavigatorComponent } from "./commit-navigator.component";

@NgModule({
    imports: [CommonModule, FormsModule, MatButtonModule, MatChipsModule, MatIconModule, MatDividerModule, NgbModule],
    exports: [CommitNavigatorComponent],
    declarations: [CommitNavigatorComponent],
})
export class CommitNavigatorModule {}
