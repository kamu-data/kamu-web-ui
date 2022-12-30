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
    @Input() on: boolean;
    @Input() className: string;
    @Output() toggled = new EventEmitter<boolean>();

    public onClick(): void {
        this.on = !this.on;
        this.toggled.emit(this.on);
    }
}
