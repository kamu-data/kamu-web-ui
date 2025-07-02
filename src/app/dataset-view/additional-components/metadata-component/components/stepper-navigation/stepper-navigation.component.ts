/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MaybeNull } from "src/app/interface/app.types";
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";
import { SourcesSection } from "../source-events/add-polling-source/process-form.service.types";
import { MatButtonModule } from "@angular/material/button";
import { NgIf } from "@angular/common";
import { CdkStepper } from "@angular/cdk/stepper";

@Component({
    selector: "app-stepper-navigation",
    templateUrl: "./stepper-navigation.component.html",
    styleUrls: ["./stepper-navigation.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        //-----//
        NgIf,

        //-----//
        MatButtonModule,
    ],
})
export class StepperNavigationComponent extends CdkStepper {
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
