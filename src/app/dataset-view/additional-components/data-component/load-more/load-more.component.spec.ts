import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonToggleModule } from "@angular/material/button-toggle";

import { LoadMoreComponent } from "./load-more.component";
import AppValues from "../../../../common/app.values";
import { FormsModule } from "@angular/forms";
import {
    dispatchInputEvent,
    emitClickOnElement,
    emitClickOnElementByDataTestId,
} from "../../../../common/base-test.helpers.spec";

describe("LoadMoreComponent", () => {
    let component: LoadMoreComponent;
    let fixture: ComponentFixture<LoadMoreComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatButtonToggleModule, FormsModule, MatIconModule],
            declarations: [LoadMoreComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(LoadMoreComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should change number of rows on button click", fakeAsync(() => {
        const options = component.ROWS_OPTIONS;
        expect(component.rowsNumber).toEqual(AppValues.SQL_QUERY_LIMIT);
        emitClickOnElement(fixture, `[data-test-id="row-limit-${options[0]}"] button`);
        expect(component.rowsNumber).toEqual(options[0]);
    }));

    it("should change number of rows on new input value", fakeAsync(() => {
        const newRowsNumber = 76;
        expect(component.rowsNumber).toEqual(AppValues.SQL_QUERY_LIMIT);
        dispatchInputEvent(fixture, "row-limit-input", newRowsNumber.toString());
        expect(component.rowsNumber).toEqual(newRowsNumber);
    }));
});
