import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormGroupDirective } from "@angular/forms";

import { MergeStepComponent } from "./merge-step.component";

describe("MergeStepComponent", () => {
    let component: MergeStepComponent;
    let fixture: ComponentFixture<MergeStepComponent>;
    const fb = new FormBuilder();
    const formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = fb.group({
        merge: fb.control(null),
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [MergeStepComponent],
            providers: [
                FormGroupDirective,
                FormBuilder,
                { provide: FormGroupDirective, useValue: formGroupDirective },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(MergeStepComponent);
        component = fixture.componentInstance;
        component.mergeForm = formGroupDirective.form;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
