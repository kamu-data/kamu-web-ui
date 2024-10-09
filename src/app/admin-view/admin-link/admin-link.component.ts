import { ChangeDetectionStrategy, Component, Input } from "@angular/core";

@Component({
    selector: "app-admin-link",
    templateUrl: "./admin-link.component.html",
    styleUrls: ["./admin-link.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLinkComponent {
    @Input({ required: true }) adminPrivileges: boolean;
    @Input() theme: string = "light-theme";
}
