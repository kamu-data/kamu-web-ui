import { MaybeNull } from "src/app/common/app.types";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { SourcesSection } from "../add-polling-source/process-form.service.types";

@Component({
    selector: "app-stepper-navigation",
    templateUrl: "./stepper-navigation.component.html",
    styleUrls: ["./stepper-navigation.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepperNavigationComponent {
    @Input() public nextStep: MaybeNull<SourcesSection> = null;
    @Input() public prevStep: MaybeNull<SourcesSection> = null;
    @Input() public validStep?: boolean;
    @Output() public changeStepEmitter = new EventEmitter<SourcesSection>();
    @Output() public saveEventEmitter = new EventEmitter<null>();
    @Output() public editYamlEmitter = new EventEmitter<null>();

    public changeStep(step: SourcesSection): void {
        this.changeStepEmitter.emit(step);
    }

    public saveEvent(): void {
        this.saveEventEmitter.emit();
    }

    public editYaml(): void {
        this.editYamlEmitter.emit();
    }
}
