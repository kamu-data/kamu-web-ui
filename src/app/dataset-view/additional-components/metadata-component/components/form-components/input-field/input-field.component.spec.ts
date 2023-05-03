/* eslint-disable @typescript-eslint/unbound-method */
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { InputFieldComponent } from "./input-field.component";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import {
    dispatchInputEvent,
    findInputElememtByDataTestId,
} from "src/app/common/base-test.helpers.spec";
import { ChangeDetectionStrategy } from "@angular/core";
import AppValues from "src/app/common/app.values";

describe("InputFieldComponent", () => {
    let component: InputFieldComponent;
    let fixture: ComponentFixture<InputFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InputFieldComponent, TooltipIconComponent],
            imports: [ReactiveFormsModule, NgbTooltipModule],
        })
            .overrideComponent(InputFieldComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(InputFieldComponent);
        component = fixture.componentInstance;

        component.form = new FormGroup({
            test: new FormControl("", [
                Validators.required,
                Validators.pattern(AppValues.URL_PATTERN),
            ]),
        });
        component.controlName = "test";
        component.dataTestId = "input";
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check required validation error", () => {
        fixture.detectChanges();
        dispatchInputEvent(fixture, "input", "");

        const requiredMessage = findInputElememtByDataTestId(
            fixture,
            "error-test-required",
        );
        expect(requiredMessage.textContent?.trim()).toBe("Field is required");
    });

    it("should check maxLength validation error", () => {
        component.form = new FormGroup({
            test: new FormControl("", [Validators.maxLength(1)]),
        });
        fixture.detectChanges();

        dispatchInputEvent(fixture, "input", "mock");

        const maxLengthdMessage = findInputElememtByDataTestId(
            fixture,
            "error-test-maxLength",
        );
        expect(maxLengthdMessage.textContent?.trim()).toBe(
            "Field can be max 1 character",
        );
    });

    it("should check pattern validation error", () => {
        fixture.detectChanges();

        dispatchInputEvent(fixture, "input", "mock");

        const patternMessage = findInputElememtByDataTestId(
            fixture,
            "error-test-pattern",
        );
        expect(patternMessage.textContent?.trim()).toBe(
            "Field format is wrong",
        );
    });
});
