import AppValues from "src/app/common/app.values";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TEST_BLOCK_HASH } from "./../../api/mock/dataset.mock";
import {
    ComponentFixture,
    fakeAsync,
    flush,
    TestBed,
    tick,
} from "@angular/core/testing";
import {
    emitClickOnElement,
    findElementByDataTestId,
} from "src/app/common/base-test.helpers.spec";
import { mockDatasetInfo } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";
import { DisplayHashComponent } from "./display-hash.component";

describe("DisplayHashComponent", () => {
    let component: DisplayHashComponent;
    let fixture: ComponentFixture<DisplayHashComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DisplayHashComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(DisplayHashComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        component.value = TEST_BLOCK_HASH;
        component.navigationTargetDataset = mockDatasetInfo;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check navigate to metadata block page", () => {
        const navigateToMetadataBlockSpy = spyOn(
            navigationService,
            "navigateToMetadataBlock",
        );
        emitClickOnElement(fixture, '[data-test-id="navigableValue"]');

        expect(navigateToMetadataBlockSpy).toHaveBeenCalledWith({
            datasetName: mockDatasetInfo.datasetName,
            accountName: mockDatasetInfo.accountName,
            blockHash: TEST_BLOCK_HASH,
        });
    });

    it("should check call copyToClipboard method", fakeAsync(() => {
        component.showCopyButton = true;
        fixture.detectChanges();

        const copyToClipboardButton = findElementByDataTestId(
            fixture,
            "copyToClipboardButton",
        );
        expect(copyToClipboardButton).toBeDefined();

        emitClickOnElement(fixture, '[data-test-id="copyToClipboardButton"]');

        expect(
            copyToClipboardButton.classList.contains("clipboard-btn--success"),
        ).toEqual(true);

        tick(AppValues.LONG_DELAY_MS);

        expect(
            copyToClipboardButton.classList.contains("clipboard-btn--success"),
        ).toEqual(false);

        flush();
    }));

    it("should check hash length", () => {
        component.navigationTargetDataset = undefined;
        fixture.detectChanges();
        const spanElement = findElementByDataTestId(
            fixture,
            "notNavigableValue",
        );
        expect(spanElement.textContent?.length).toEqual(8);
    });
});
