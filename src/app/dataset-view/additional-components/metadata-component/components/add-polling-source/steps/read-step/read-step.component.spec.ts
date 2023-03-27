import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormGroupDirective } from "@angular/forms";

import { ReadStepComponent } from "./read-step.component";

describe("ReadStepComponent", () => {
    let component: ReadStepComponent;
    let fixture: ComponentFixture<ReadStepComponent>;
    const fb = new FormBuilder();
    const formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = fb.group({
        read: fb.group({}),
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ReadStepComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                FormGroupDirective,
                FormBuilder,
                { provide: FormGroupDirective, useValue: formGroupDirective },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ReadStepComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
