import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: "app-toggle",
    templateUrl: "./toggle.component.html",
    styleUrls: ["./toggle.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleComponent {
    @Input({ required: true }) public isToggled: boolean;
    @Input({ required: true }) public className: string;
    @Output() public toggled = new EventEmitter<boolean>();

    public onClick(): void {
        this.isToggled = !this.isToggled;
        this.toggled.emit(this.isToggled);
    }
}
