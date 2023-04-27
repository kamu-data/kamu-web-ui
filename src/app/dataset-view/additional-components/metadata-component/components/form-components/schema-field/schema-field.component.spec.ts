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
    emitClickOnElement,
    findElementByDataTestId,
} from "src/app/common/base-test.helpers.spec";

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
            schema: new FormArray([
                new FormGroup({
                    name: new FormControl("id", [
                        RxwebValidators.unique(),
                        RxwebValidators.required(),
                        RxwebValidators.noneOf({
                            matchValues: component.AVAILABLE_TYPES,
                        }),
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
        emitClickOnElement(fixture, '[data-test-id="add-row-button"]');
        expect(component.items.length).toBe(2);
    });

    it("should check delete row to form array", () => {
        expect(component.items.length).toBe(1);
        emitClickOnElement(fixture, '[data-test-id="delete-row-button-0"]');
        expect(component.items.length).toBe(0);
    });

    it("should check unique validation message", () => {
        component.addRow();
        fixture.detectChanges();
        const controlName_1 = findElementByDataTestId(
            fixture,
            "name-control-1",
        ) as HTMLInputElement;
        controlName_1.value = "id";
        controlName_1.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.nameControlError(1)).toBe("Name is not unique");
    });

    it("should check required validation message", () => {
        component.addRow();
        fixture.detectChanges();
        const controlName_1 = findElementByDataTestId(
            fixture,
            "name-control-1",
        ) as HTMLInputElement;
        controlName_1.value = "";
        controlName_1.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.nameControlError(1)).toBe("Name is required");
    });

    it("should check noneOf validation message", () => {
        component.addRow();
        fixture.detectChanges();
        const controlName_1 = findElementByDataTestId(
            fixture,
            "name-control-1",
        ) as HTMLInputElement;
        controlName_1.value = "STRING";
        controlName_1.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.nameControlError(1)).toBe("Type cannot be name");
    });

    it("should check swap row", () => {
        component.addRow();
        fixture.detectChanges();
        const controlName_1 = findElementByDataTestId(
            fixture,
            "name-control-1",
        ) as HTMLInputElement;
        controlName_1.value = "name";
        controlName_1.dispatchEvent(new Event("input"));
        const typeName_1 = findElementByDataTestId(
            fixture,
            "type-control-1",
        ) as HTMLInputElement;
        typeName_1.value = "STRING";
        typeName_1.dispatchEvent(new Event("input"));
        fixture.detectChanges();
        expect(component.items.controls[0].get("name")?.value).toBe("id");

        emitClickOnElement(fixture, '[data-test-id="move-down-button-0"]');
        fixture.detectChanges();
        expect(component.items.controls[0].get("name")?.value).toBe("name");

        emitClickOnElement(fixture, '[data-test-id="move-up-button-1"]');
        fixture.detectChanges();
        expect(component.items.controls[0].get("name")?.value).toBe("id");
    });

    it("should check swap method not work", () => {
        emitClickOnElement(fixture, '[data-test-id="move-down-button-0"]');
        fixture.detectChanges();
        expect(component.items.controls[0].get("name")?.value).toBe("id");

        emitClickOnElement(fixture, '[data-test-id="move-up-button-0"]');
        fixture.detectChanges();
        expect(component.items.controls[0].get("name")?.value).toBe("id");
    });
});
