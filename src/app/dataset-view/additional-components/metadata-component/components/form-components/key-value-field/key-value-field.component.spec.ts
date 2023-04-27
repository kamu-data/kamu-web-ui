import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { KeyValueFieldComponent } from "./key-value-field.component";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

describe("KeyValueFieldComponent", () => {
    let component: KeyValueFieldComponent;
    let fixture: ComponentFixture<KeyValueFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [KeyValueFieldComponent,TooltipIconComponent],
            providers: [FormBuilder],
            imports: [ReactiveFormsModule,NgbTooltipModule],
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
