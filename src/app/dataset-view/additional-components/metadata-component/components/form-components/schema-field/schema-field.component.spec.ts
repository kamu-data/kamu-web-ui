import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SchemaFieldComponent } from "./schema-field.component";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatTableModule } from "@angular/material/table";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";

describe("SchemaFieldComponent", () => {
    let component: SchemaFieldComponent;
    let fixture: ComponentFixture<SchemaFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SchemaFieldComponent],
            providers: [FormBuilder],
            imports: [
                ReactiveFormsModule,
                MatIconModule,
                MatTableModule,
                NgbTypeaheadModule,
                RxReactiveFormsModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SchemaFieldComponent);
        component = fixture.componentInstance;
        component.form = new FormGroup({
            name: new FormControl(""),
            type: new FormControl(""),
        });
        component.controlName = "name";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
