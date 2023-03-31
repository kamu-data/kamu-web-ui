import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { KeyValueFieldComponent } from "./key-value-field.component";

describe("KeyValueFieldComponent", () => {
    let component: KeyValueFieldComponent;
    let fixture: ComponentFixture<KeyValueFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [KeyValueFieldComponent],
            providers: [FormBuilder],
            imports: [ReactiveFormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(KeyValueFieldComponent);
        component = fixture.componentInstance;
        component.form = new FormGroup({});
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
