import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { SelectKindFieldComponent } from "./select-kind-field.component";
import { FetchKind } from "../../source-events/add-polling-source/add-polling-source-form.types";
import { emitClickOnElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { FETCH_STEP_RADIO_CONTROLS } from "../../source-events/add-polling-source/form-control.source";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";

describe("SelectKindFieldComponent", () => {
    let component: SelectKindFieldComponent;
    let fixture: ComponentFixture<SelectKindFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SelectKindFieldComponent],
            imports: [ReactiveFormsModule, NgbTooltipModule, MatIconModule],
        }).compileComponents();

        fixture = TestBed.createComponent(SelectKindFieldComponent);
        component = fixture.componentInstance;
        component.data = FETCH_STEP_RADIO_CONTROLS;
        component.form = new FormGroup({
            kind: new FormControl(FetchKind.URL),
        });
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check switch control", () => {
        expect(component.form.value).toEqual({ kind: FetchKind.URL });

        emitClickOnElementByDataTestId(fixture, `radio-${FetchKind.FILES_GLOB}-control`);
        expect(component.form.value).toEqual({ kind: FetchKind.FILES_GLOB });

        emitClickOnElementByDataTestId(fixture, `radio-${FetchKind.CONTAINER}-control`);
        expect(component.form.value).toEqual({ kind: FetchKind.CONTAINER });
    });
});
