/* eslint-disable @typescript-eslint/unbound-method */
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
    FormBuilder,
    FormGroupDirective,
    FormControl,
    Validators,
} from "@angular/forms";
import { FetchStepComponent } from "./fetch-step.component";

describe("FetchStepComponent", () => {
    let component: FetchStepComponent;
    let fixture: ComponentFixture<FetchStepComponent>;
    const fb = new FormBuilder();
    const formGroupDirective = new FormGroupDirective([], []);
    formGroupDirective.form = fb.group({
        fetch: fb.control(new FormControl()),
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FetchStepComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                FormGroupDirective,
                FormBuilder,
                { provide: FormGroupDirective, useValue: formGroupDirective },
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FetchStepComponent);
        component = fixture.componentInstance;
        component.fetchForm = fb.group({
            kind: ["url"],
            url: ["", [Validators.required]],
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
