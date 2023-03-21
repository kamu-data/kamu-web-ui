import { MaybeNull } from "src/app/common/app.types";
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    Output,
} from "@angular/core";
import { PollingSourceSteps } from "../add-polling-source/add-polling-source.types";

@Component({
    selector: "app-stepper-navigation",
    templateUrl: "./stepper-navigation.component.html",
    styleUrls: ["./stepper-navigation.component.sass"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperNavigationComponent {
    @Input() public nextStep: MaybeNull<PollingSourceSteps>;
    @Input() public prevStep: MaybeNull<PollingSourceSteps>;
    @Output() public changeStepEmitter = new EventEmitter<PollingSourceSteps>();
    @Output() public saveEventEmitter = new EventEmitter<null>();
    @Output() public editYamlEmitter = new EventEmitter<null>();

    constructor(private cdr: ChangeDetectorRef) {}

    public changeStep(step: PollingSourceSteps): void {
        this.changeStepEmitter.emit(step);
    }

    public saveEvent(): void {
        this.saveEventEmitter.emit();
    }

    public editYaml(): void {
        this.editYamlEmitter.emit();
    }
}
