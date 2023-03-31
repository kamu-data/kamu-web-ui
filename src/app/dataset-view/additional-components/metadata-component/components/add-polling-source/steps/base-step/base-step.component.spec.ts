/* eslint-disable @typescript-eslint/unbound-method */
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormGroupDirective } from "@angular/forms";
import { BaseStepComponent } from "./base-step.component";

describe("BaseStepComponent", () => {
    let component: BaseStepComponent;
    let fixture: ComponentFixture<BaseStepComponent>;
    const fb = new FormBuilder();
    const formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = fb.group({
        fetch: fb.group({}),
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BaseStepComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],

            providers: [
                FormGroupDirective,
                FormBuilder,
                { provide: FormGroupDirective, useValue: formGroupDirective },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(BaseStepComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
