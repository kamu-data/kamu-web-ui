import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { DataAccessPanelComponent } from "./data-access-panel.component";
import AppValues from "src/app/common/app.values";
import { emitClickOnElementByDataTestId, getElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";
import { FormsModule } from "@angular/forms";
import { MatDividerModule } from "@angular/material/divider";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MatMenuModule } from "@angular/material/menu";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatTabsModule } from "@angular/material/tabs";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ProtocolsService } from "src/app/services/protocols.service";
import { of } from "rxjs";
import { mockDatasetEndPoints } from "./data-access-panel-mock.data";

describe("DataAccessPanelComponent", () => {
    let component: DataAccessPanelComponent;
    let fixture: ComponentFixture<DataAccessPanelComponent>;
    let protocolsService: ProtocolsService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo],
            declarations: [DataAccessPanelComponent],
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
        }).compileComponents();

        fixture = TestBed.createComponent(DataAccessPanelComponent);
        protocolsService = TestBed.inject(ProtocolsService);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        spyOn(protocolsService, "getProtocols").and.returnValue(of(mockDatasetEndPoints));
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should copy to clipboard", fakeAsync(() => {
        emitClickOnElementByDataTestId(fixture, "searchAdditionalButtons");

        const menu = getElementByDataTestId(fixture, "menu");
        expect(menu).toBeDefined();

        const copyToClipboardButton = getElementByDataTestId(fixture, "copyToClipboard-clipboardReference");
        emitClickOnElementByDataTestId(fixture, "copyToClipboard-clipboardReference");
        expect(copyToClipboardButton.classList.contains("clipboard-btn--success")).toEqual(true);

        tick(AppValues.LONG_DELAY_MS);

        expect(copyToClipboardButton.classList.contains("clipboard-btn--success")).toEqual(false);

        flush();
    }));
});
