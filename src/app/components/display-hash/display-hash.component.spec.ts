import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TEST_BLOCK_HASH } from "./../../api/mock/dataset.mock";
import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import {
    emitClickOnElementByDataTestId,
    findElementByDataTestId,
} from "src/app/common/base-test.helpers.spec";
import { mockDatasetInfo } from "src/app/search/mock.data";
import { NavigationService } from "src/app/services/navigation.service";
import { DisplayHashComponent } from "./display-hash.component";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("DisplayHashComponent", () => {
    let component: DisplayHashComponent;
    let fixture: ComponentFixture<DisplayHashComponent>;
    let navigationService: NavigationService;
    let toastService: ToastrService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DisplayHashComponent],
            imports: [ToastrModule.forRoot(), BrowserAnimationsModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(DisplayHashComponent);
        navigationService = TestBed.inject(NavigationService);
        toastService = TestBed.inject(ToastrService);
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
        emitClickOnElementByDataTestId(fixture, "navigableValue");

        expect(navigateToMetadataBlockSpy).toHaveBeenCalledWith({
            datasetName: mockDatasetInfo.datasetName,
            accountName: mockDatasetInfo.accountName,
            blockHash: TEST_BLOCK_HASH,
        });
    });

    it("should check copyToClipboard button is exist", fakeAsync(() => {
        component.showCopyButton = true;
        fixture.detectChanges();

        const copyToClipboardButton = findElementByDataTestId(
            fixture,
            "copyToClipboardButton",
        );
        expect(copyToClipboardButton).toBeDefined();
    }));

    it("should check copyToClipboard button is work", fakeAsync(() => {
        const successToastServiceSpy = spyOn(toastService, "success");
        component.showCopyButton = true;
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "copyToClipboardButton");

        expect(successToastServiceSpy).toHaveBeenCalledWith("Copied");
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
