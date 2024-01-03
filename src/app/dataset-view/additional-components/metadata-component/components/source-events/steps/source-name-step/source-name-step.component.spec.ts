import { InputFieldComponent } from "../../../form-components/input-field/input-field.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SourceNameStepComponent } from "./source-name-step.component";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("SourceNameStepComponent", () => {
    let component: SourceNameStepComponent;
    let fixture: ComponentFixture<SourceNameStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SourceNameStepComponent, InputFieldComponent, TooltipIconComponent],
            imports: [ReactiveFormsModule, NgbTooltipModule, SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(SourceNameStepComponent);
        component = fixture.componentInstance;
        component.form = component.form = new FormGroup({
            sourceName: new FormControl(""),
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
