import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import {
    findElementByDataTestId,
    emitClickOnElement,
} from "src/app/common/base-test.helpers.spec";
import { mockSeed } from "../../mock.events";

import { SeedEventComponent } from "./seed-event.component";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("SeedEventComponent", () => {
    let component: SeedEventComponent;
    let fixture: ComponentFixture<SeedEventComponent>;
    let toastService: ToastrService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SeedEventComponent],
            imports: [ToastrModule.forRoot(), BrowserAnimationsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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

    it("should check copyToClipboard button is exist", fakeAsync(() => {
        const copyToClipboardButton = findElementByDataTestId(
            fixture,
            "copyToClipboardId",
        );
        expect(copyToClipboardButton).toBeDefined();
    }));

    it("should check copyToClipboard button is work", fakeAsync(() => {
        const successToastServiceSpy = spyOn(toastService, "success");
        emitClickOnElement(fixture, '[data-test-id="copyToClipboardId"]');
        expect(successToastServiceSpy).toHaveBeenCalledWith("Copied");
    }));
});
