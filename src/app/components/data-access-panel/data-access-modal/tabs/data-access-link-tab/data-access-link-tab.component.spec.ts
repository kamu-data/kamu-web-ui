import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { DataAccessLinkTabComponent } from "./data-access-link-tab.component";
import { mockDatasetEndPoints } from "../../../data-access-panel-mock.data";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTooltipModule } from "@angular/material/tooltip";
import AppValues from "src/app/common/app.values";
import {
    getElementByDataTestId,
    emitClickOnElementByDataTestId,
    registerMatSvgIcons,
} from "src/app/common/base-test.helpers.spec";

describe("DataAccessLinkTabComponent", () => {
    let component: DataAccessLinkTabComponent;
    let fixture: ComponentFixture<DataAccessLinkTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DataAccessLinkTabComponent],
            imports: [
                FormsModule,
                MatDividerModule,
                MatIconModule,
                MatTooltipModule,
                HttpClientTestingModule,
                MatCheckboxModule,
            ],
        });

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DataAccessLinkTabComponent);
        component = fixture.componentInstance;
        component.webLink = mockDatasetEndPoints.webLink;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should copy to clipboard", fakeAsync(() => {
        const copyToClipboardButton = getElementByDataTestId(fixture, "copyToClipboard-clipboardReference");
        emitClickOnElementByDataTestId(fixture, "copyToClipboard-clipboardReference");
        expect(copyToClipboardButton.classList.contains("clipboard-btn--success")).toEqual(true);

        tick(AppValues.LONG_DELAY_MS);

        expect(copyToClipboardButton.classList.contains("clipboard-btn--success")).toEqual(false);

        flush();
    }));
});
