import { AccountInfo } from "src/app/api/kamu.graphql.interface";
import { FormsModule } from "@angular/forms";
import { MatMenuModule } from "@angular/material/menu";
import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import {
    emitClickOnElement,
    findElementByDataTestId,
    findNativeElement,
} from "src/app/common/base-test.helpers.spec";
import { AppHeaderComponent } from "./app-header.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";

describe("AppHeaderComponent", () => {
    let component: AppHeaderComponent;
    let fixture: ComponentFixture<AppHeaderComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                MatMenuModule,
                FormsModule,
                BrowserModule,
                NgbTypeaheadModule,
            ],
            declarations: [AppHeaderComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [Apollo],
        })
            .overrideComponent(AppHeaderComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(AppHeaderComponent);
        component = fixture.componentInstance;
        component.isVisible = true;
        fixture.detectChanges();
    });

    it("should create", async () => {
        await expect(component).toBeTruthy();
    });

    it("should check focus on input", async () => {
        const searchInput = findElementByDataTestId(fixture, "searchInput");
        const focusElementSpy = spyOn(searchInput, "focus");
        component.onClickInput();
        await expect(focusElementSpy).toHaveBeenCalledTimes(1);
    });

    it("should check dataset type", async () => {
        await expect(component.isDatasetType("Dataset")).toBeTruthy();
        await expect(component.isDatasetType("all")).toBeFalsy();
    });

    [false, true].forEach((isExpectation: boolean) => {
        it(`should ${
            isExpectation ? "close" : "open"
        } header menu`, async () => {
            component.isCollapsedAppHeaderMenu = isExpectation;
            const headerMenu = findNativeElement(fixture, "#app-header");
            emitClickOnElement(fixture, "#appHeaderMenuButton");
            isExpectation
                ? await expect(
                      headerMenu.classList.contains("Details--on"),
                  ).toBeFalsy()
                : await expect(
                      headerMenu.classList.contains("Details--on"),
                  ).toBeTruthy();
        });
    });

    it("should emit on click app logo", async () => {
        const clickAppLogoEmitterSpy = spyOn(
            component.clickAppLogoEmitter,
            "emit",
        );
        const link = findElementByDataTestId(fixture, "appLogo");
        link.click();
        await expect(clickAppLogoEmitterSpy).toHaveBeenCalled();
    });

    it("should emit on click Help link", async () => {
        const clickHelpEmitterSpy = spyOn(component.clickHelpEmitter, "emit");
        const link = findElementByDataTestId(fixture, "openHelpHeader");
        link.click();
        await expect(clickHelpEmitterSpy).toHaveBeenCalled();
    });

    it("should emit on click AddNew link", async () => {
        const addNewEmitterSpy = spyOn(component.addNewEmitter, "emit");
        const link = findElementByDataTestId(fixture, "addNewDataset");
        link.click();
        await expect(addNewEmitterSpy).toHaveBeenCalled();
    });

    it("should emit on click Settings link", async () => {
        component.userInfo = { login: "ssss", name: "testName" } as AccountInfo;
        const clickSettingsEmitterSpy = spyOn(
            component.clickSettingsEmitter,
            "emit",
        );
        emitClickOnElement(fixture, "#appHeaderMenuButton");
        fixture.detectChanges();
        const link = findElementByDataTestId(fixture, "openSettingsHeader");
        link.click();
        await expect(clickSettingsEmitterSpy).toHaveBeenCalled();
    });

    it("should emit on click Your profile link", async () => {
        component.userInfo = { login: "ssss", name: "testName" } as AccountInfo;
        const clickUserProfileEmitterSpy = spyOn(
            component.clickUserProfileEmitter,
            "emit",
        );
        emitClickOnElement(fixture, "#appHeaderMenuButton");
        fixture.detectChanges();
        const link = findElementByDataTestId(fixture, "openUserProfileHeader");
        link.click();
        await expect(clickUserProfileEmitterSpy).toHaveBeenCalled();
    });

    it("should emit on click Analytics link", async () => {
        component.userInfo = { login: "ssss", name: "testName" } as AccountInfo;
        const clickAnalyticsEmitterSpy = spyOn(
            component.clickAnalyticsEmitter,
            "emit",
        );
        emitClickOnElement(fixture, "#appHeaderMenuButton");
        fixture.detectChanges();
        const link = findElementByDataTestId(fixture, "openAnalyticsHeader");
        link.click();
        await expect(clickAnalyticsEmitterSpy).toHaveBeenCalled();
    });

    it("should emit on click LogOut link", async () => {
        component.userInfo = { login: "ssss", name: "testName" } as AccountInfo;
        const logOutEmitterSpy = spyOn(component.logOutEmitter, "emit");
        emitClickOnElement(fixture, "#appHeaderMenuButton");
        fixture.detectChanges();
        const link = findElementByDataTestId(fixture, "openSignOutHeader");
        link.click();
        await expect(logOutEmitterSpy).toHaveBeenCalled();
    });

    it("should emit on click Login link", async () => {
        const loginEmitterSpy = spyOn(component.loginEmitter, "emit");
        const link = findElementByDataTestId(fixture, "openUserProfileHeader");
        link.click();
        await expect(loginEmitterSpy).toHaveBeenCalled();
    });

    it("should emit on click Billing link", async () => {
        const clickBillingEmitterSpy = spyOn(
            component.clickBillingEmitter,
            "emit",
        );
        const link = findElementByDataTestId(fixture, "openBillingPlanHeader");
        link.click();
        await expect(clickBillingEmitterSpy).toHaveBeenCalled();
    });

    it("should emit on click Your datasets link", async () => {
        const clickUserDatasetsEmitterSpy = spyOn(
            component.clickUserDatasetsEmitter,
            "emit",
        );
        component.onUserDatasets();
        await expect(clickUserDatasetsEmitterSpy).toHaveBeenCalled();
    });

    it("should emit on click User Info link", async () => {
        const userProfileEmitterSpy = spyOn(
            component.userProfileEmitter,
            "emit",
        );
        component.onOpenUserInfo();
        await expect(userProfileEmitterSpy).toHaveBeenCalled();
    });

    it("should check search method", fakeAsync(async () => {
        component.isMobileView = true;
        const triggerMenuClickSpy = spyOn(
            component,
            "triggerMenuClick",
        ).and.callThrough();
        const event = new KeyboardEvent("keyup", {
            key: "Enter",
        });
        const el = findElementByDataTestId(fixture, "searchInput");
        el.dispatchEvent(event);
        tick(201);
        await expect(triggerMenuClickSpy).toHaveBeenCalled();
    }));
});
