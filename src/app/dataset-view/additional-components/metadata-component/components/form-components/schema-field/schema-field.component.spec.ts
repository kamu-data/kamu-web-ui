import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SchemaFieldComponent, SchemaType } from "./schema-field.component";
import {
    FormArray,
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
import {
    RxReactiveFormsModule,
    RxwebValidators,
} from "@rxweb/reactive-form-validators";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import {
    dispatchInputEvent,
    emitClickOnElementByDataTestId,
} from "src/app/common/base-test.helpers.spec";
import { SharedTestModule } from "src/app/common/shared-test.module";

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
                SharedTestModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SchemaFieldComponent);
        component = fixture.componentInstance;
        component.form = new FormGroup({
            schema: new FormArray([
                new FormGroup({
                    name: new FormControl("id", [
                        RxwebValidators.unique(),
                        RxwebValidators.required(),
                    ]),
                    type: new FormControl("BIGINT", [
                        RxwebValidators.required(),
                    ]),
                }),
            ]),
        });
        component.controlName = "schema";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check add row to form array", () => {
        const item: SchemaType = { name: "id", type: "BIGINT" };
        component.focus$.next(item);
        expect(component.items.length).toBe(1);
        emitClickOnElementByDataTestId(fixture, "add-row-button");
        expect(component.items.length).toBe(2);
    });

    it("should check delete row to form array", () => {
        expect(component.items.length).toBe(1);
        emitClickOnElementByDataTestId(fixture, "delete-row-button-0");
        expect(component.items.length).toBe(0);
    });

    it("should check unique validation message", () => {
        component.addRow();
        fixture.detectChanges();
        dispatchInputEvent(fixture, "name-control-1", "id");
        expect(component.nameControlError(1)).toBe("Name is not unique");
    });

    it("should check required validation message", () => {
        component.addRow();
        fixture.detectChanges();
        dispatchInputEvent(fixture, "name-control-1", "");
        expect(component.nameControlError(1)).toBe("Name is required");
    });

    it("should check swap row", () => {
        component.addRow();
        fixture.detectChanges();
        dispatchInputEvent(fixture, "name-control-1", "name");
        dispatchInputEvent(fixture, "type-control-1", "STRING");
        expect(component.items.controls[0].get("name")?.value).toBe("id");

        emitClickOnElementByDataTestId(fixture, "move-down-button-0");
        fixture.detectChanges();
        expect(component.items.controls[0].get("name")?.value).toBe("name");

        emitClickOnElementByDataTestId(fixture, "move-up-button-1");
        fixture.detectChanges();
        expect(component.items.controls[0].get("name")?.value).toBe("id");
    });

    it("should check swap method not work", () => {
        emitClickOnElementByDataTestId(fixture, "move-down-button-0");
        fixture.detectChanges();
        expect(component.items.controls[0].get("name")?.value).toBe("id");

        emitClickOnElementByDataTestId(fixture, "move-up-button-0");
        fixture.detectChanges();
        expect(component.items.controls[0].get("name")?.value).toBe("id");
    });

    it("should check pattern validation message", () => {
        component.addRow();
        fixture.detectChanges();
        dispatchInputEvent(fixture, "name-control-1", "&");
        expect(component.nameControlError(1)).toBe("Incorrect character");
    });
});
