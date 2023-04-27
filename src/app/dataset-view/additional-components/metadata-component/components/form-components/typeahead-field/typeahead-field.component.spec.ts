import {
    NgbTooltipModule,
    NgbTypeaheadModule,
} from "@ng-bootstrap/ng-bootstrap";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TypeaheadFieldComponent } from "./typeahead-field.component";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { MatIconModule } from "@angular/material/icon";
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";

describe("TypeaheadFieldComponent", () => {
    let component: TypeaheadFieldComponent;
    let fixture: ComponentFixture<TypeaheadFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [TypeaheadFieldComponent, TooltipIconComponent],
            imports: [
                NgbTypeaheadModule,
                MatIconModule,
                FormsModule,
                ReactiveFormsModule,
                NgbTooltipModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(TypeaheadFieldComponent);
        component = fixture.componentInstance;
        component.data = [];
        component.controlName = "name";
        component.form = new FormGroup({
            name: new FormControl(""),
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
