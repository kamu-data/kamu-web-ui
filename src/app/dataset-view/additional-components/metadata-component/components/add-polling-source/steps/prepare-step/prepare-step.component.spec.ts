import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PrepareStepComponent } from "./prepare-step.component";
import {
    FormBuilder,
    FormGroupDirective,
    ReactiveFormsModule,
} from "@angular/forms";
import { Apollo } from "apollo-angular";
import { DatasetApi } from "src/app/api/dataset.api";
import { formGroupDirective } from "../base-step/base-step.component.spec";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { SetPollingSourceSection } from "src/app/shared/shared.types";
import { MatIconModule } from "@angular/material/icon";

describe("PrepareStepComponent", () => {
    let component: PrepareStepComponent;
    let fixture: ComponentFixture<PrepareStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PrepareStepComponent],
            providers: [
                Apollo,
                DatasetApi,
                FormGroupDirective,
                FormBuilder,
                { provide: FormGroupDirective, useValue: formGroupDirective },
            ],
            imports: [SharedTestModule, ReactiveFormsModule, MatIconModule],
        }).compileComponents();

        fixture = TestBed.createComponent(PrepareStepComponent);
        component = fixture.componentInstance;
        component.sectionName = SetPollingSourceSection.PREPARE;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
