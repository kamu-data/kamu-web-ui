import {
    FormArray,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
} from "@angular/forms";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { KeyValueFieldComponent } from "./key-value-field.component";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { emitClickOnElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("KeyValueFieldComponent", () => {
    let component: KeyValueFieldComponent;
    let fixture: ComponentFixture<KeyValueFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [KeyValueFieldComponent, TooltipIconComponent],
            providers: [FormBuilder],
            imports: [ReactiveFormsModule, NgbTooltipModule, SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(KeyValueFieldComponent);
        component = fixture.componentInstance;
        component.controlName = "primaryKey";
        component.buttonText = "Add key";
        component.form = new FormGroup({
            [component.controlName]: new FormArray([]),
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check add new item to array", () => {
        expect(component.items.length).toBe(0);
        emitClickOnElementByDataTestId(fixture, "add-button");
        fixture.detectChanges();
        expect(component.items.length).toBe(1);
    });

    it("should check delete item from array", () => {
        emitClickOnElementByDataTestId(fixture, "add-button");
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "item-0");
        fixture.detectChanges();
        expect(component.items.length).toBe(0);
    });
});
