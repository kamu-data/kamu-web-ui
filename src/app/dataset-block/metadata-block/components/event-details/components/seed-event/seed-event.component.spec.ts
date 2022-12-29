import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from "@angular/core/testing";
import {
    findElementByDataTestId,
    emitClickOnElement,
} from "src/app/common/base-test.helpers.spec";
import { mockSeed } from "../../mock.events";

import { SeedEventComponent } from "./seed-event.component";

describe("SeedEventComponent", () => {
    let component: SeedEventComponent;
    let fixture: ComponentFixture<SeedEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SeedEventComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(SeedEventComponent);
        component = fixture.componentInstance;
        component.event = mockSeed;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check call copyToClipboard method", fakeAsync(() => {
        const copyToClipboardButton = findElementByDataTestId(
            fixture,
            "copyToClipboardId",
        );
        expect(copyToClipboardButton).toBeDefined();

        emitClickOnElement(fixture, '[data-test-id="copyToClipboardId"]');

        expect(
            copyToClipboardButton.classList.contains("clipboard-btn--success"),
        ).toEqual(true);

        tick(2001);

        expect(
            copyToClipboardButton.classList.contains("clipboard-btn--success"),
        ).toEqual(false);

        flush();
    }));
});
