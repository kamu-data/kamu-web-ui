import { MaybeNull } from "src/app/common/app.types";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";
import { SetPollingSourceSection } from "src/app/shared/shared.types";

@Component({
    selector: "app-stepper-navigation",
    templateUrl: "./stepper-navigation.component.html",
    styleUrls: ["./stepper-navigation.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperNavigationComponent {
    @Input() public nextStep: MaybeNull<SetPollingSourceSection>;
    @Input() public prevStep: MaybeNull<SetPollingSourceSection>;
    @Input() public validStep: boolean;
    @Output() public changeStepEmitter =
        new EventEmitter<SetPollingSourceSection>();
    @Output() public saveEventEmitter = new EventEmitter<null>();
    @Output() public editYamlEmitter = new EventEmitter<null>();

    constructor(private cdr: ChangeDetectorRef) {}

    public changeStep(step: SetPollingSourceSection): void {
        this.changeStepEmitter.emit(step);
    }

    public saveEvent(): void {
        this.saveEventEmitter.emit();
    }

    public editYaml(): void {
        this.editYamlEmitter.emit();
    }
}
