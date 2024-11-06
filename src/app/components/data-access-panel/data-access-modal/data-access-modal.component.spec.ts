import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { DataAccessModalComponent } from "./data-access-modal.component";
import AppValues from "src/app/common/app.values";
import { emitClickOnElementByDataTestId, getElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { Apollo, ApolloModule } from "apollo-angular";
import { of } from "rxjs";
import { mockDatasetEndPoints } from "../data-access-panel-mock.data";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularSvgIconModule } from "angular-svg-icon";
import { ApolloTestingModule } from "apollo-angular/testing";

describe("DataAccessModalComponent", () => {
    let component: DataAccessModalComponent;
    let fixture: ComponentFixture<DataAccessModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            declarations: [DataAccessModalComponent],
            imports: [
                FormsModule,
                MatDividerModule,
                MatCheckboxModule,
                MatIconModule,
                MatTooltipModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                MatMenuModule,
                MatTabsModule,
                BrowserAnimationsModule,
                ApolloModule,
                ApolloTestingModule,
            ],
        });
        fixture = TestBed.createComponent(DataAccessModalComponent);
        component = fixture.componentInstance;
        component.protocols$ = of(mockDatasetEndPoints);
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
