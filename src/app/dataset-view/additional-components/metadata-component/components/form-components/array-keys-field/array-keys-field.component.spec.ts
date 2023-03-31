import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from "@angular/forms";

import { ArrayKeysFieldComponent } from "./array-keys-field.component";

describe("ArrayKeysFieldComponent", () => {
    let component: ArrayKeysFieldComponent;
    let fixture: ComponentFixture<ArrayKeysFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ArrayKeysFieldComponent],
            providers: [FormBuilder],
            imports: [ReactiveFormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(ArrayKeysFieldComponent);
        component = fixture.componentInstance;
        component.form = new FormGroup({ test: new FormControl("") });
        component.controlName = "test";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
