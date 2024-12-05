import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "app-admin-available-button",
    templateUrl: "./admin-available-button.component.html",
    styleUrls: ["./admin-available-button.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminAvailableButtonComponent {
    @Input() public visible: boolean = true;
    @Input() public icon: string = "";
    @Input({ required: true }) public label: string;
    @Input() public class?: string;
    @Input() public disabled: boolean;
    @Input() public datasetId: string;
    @Input() public showAdwinIcon: boolean;
    @Input() public adminPrivileges: boolean;
    @Output() public onClick = new EventEmitter<void>();

    public click(): void {
        this.onClick.emit();
    }
}
