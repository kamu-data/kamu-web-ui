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
import {
    NgbTooltipModule,
    NgbTypeaheadModule,
} from "@ng-bootstrap/ng-bootstrap";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";

describe("SchemaFieldComponent", () => {
    let component: SchemaFieldComponent;
    let fixture: ComponentFixture<SchemaFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SchemaFieldComponent, TooltipIconComponent],
            providers: [FormBuilder],
            imports: [
                ReactiveFormsModule,
                MatIconModule,
                MatTableModule,
                NgbTypeaheadModule,
                RxReactiveFormsModule,
                NgbTooltipModule,
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
