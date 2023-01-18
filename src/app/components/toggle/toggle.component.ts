import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";

@Component({
    selector: "app-toggle",
    templateUrl: "./toggle.component.html",
    styleUrls: ["./toggle.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleComponent {
    @Input() public isToggled: boolean;
    @Input() public className: string;
    @Output() public toggled = new EventEmitter<boolean>();

    public onClick(): void {
        this.isToggled = !this.isToggled;
        this.toggled.emit(this.isToggled);
    }
}
