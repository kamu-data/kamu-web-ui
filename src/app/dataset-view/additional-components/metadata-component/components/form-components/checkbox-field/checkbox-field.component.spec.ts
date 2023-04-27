import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";

import { CheckboxFieldComponent } from "./checkbox-field.component";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

describe("CheckboxFieldComponent", () => {
    let component: CheckboxFieldComponent;
    let fixture: ComponentFixture<CheckboxFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CheckboxFieldComponent, TooltipIconComponent],
            imports: [ReactiveFormsModule, NgbTooltipModule],
        }).compileComponents();

        fixture = TestBed.createComponent(CheckboxFieldComponent);
        component = fixture.componentInstance;
        component.form = new FormGroup({ test: new FormControl("") });
        component.controlName = "test";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
