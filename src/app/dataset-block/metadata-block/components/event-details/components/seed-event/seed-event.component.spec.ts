import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
    findElementByDataTestId,
    emitClickOnElementByDataTestId,
} from "src/app/common/base-test.helpers.spec";
import { mockSeed } from "../../mock.events";

import { SeedEventComponent } from "./seed-event.component";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BlockRowDataComponent } from "../../../block-row-data/block-row-data.component";
import { TooltipIconComponent } from "../../../tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { AngularSvgIconModule } from "angular-svg-icon";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("SeedEventComponent", () => {
    let component: SeedEventComponent;
    let fixture: ComponentFixture<SeedEventComponent>;
    let toastService: ToastrService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                SeedEventComponent,
                BlockRowDataComponent,
                TooltipIconComponent,
            ],
            imports: [
                ToastrModule.forRoot(),
                BrowserAnimationsModule,
                NgbTooltipModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SeedEventComponent);
        toastService = TestBed.inject(ToastrService);
        component = fixture.componentInstance;
        component.event = mockSeed;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check copyToClipboard button is exist", () => {
        const copyToClipboardButton = findElementByDataTestId(
            fixture,
            "copyToClipboardId",
        );
        expect(copyToClipboardButton).toBeDefined();
    });

    it("should check copyToClipboard button is work", () => {
        const successToastServiceSpy = spyOn(toastService, "success");
        emitClickOnElementByDataTestId(fixture, "copyToClipboardId");
        expect(successToastServiceSpy).toHaveBeenCalledWith("Copied");
    });
});
