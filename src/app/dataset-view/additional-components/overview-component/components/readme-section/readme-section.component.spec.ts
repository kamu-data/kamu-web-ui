/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { SimpleChanges } from "@angular/core";
import { ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";

import { of } from "rxjs";

import { Apollo } from "apollo-angular";
import { MarkdownModule } from "ngx-markdown";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { ReadmeSectionComponent } from "src/app/dataset-view/additional-components/overview-component/components/readme-section/readme-section.component";
import { EditMode } from "src/app/dataset-view/additional-components/overview-component/components/readme-section/readme-section.types";
import { DatasetCommitService } from "src/app/dataset-view/additional-components/overview-component/services/dataset-commit.service";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";

import {
    emitClickOnElementByDataTestId,
    findNativeElement,
    registerMatSvgIcons,
} from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { mockAccountDetails } from "@api/mock/auth.mock";

describe("ReadmeSectionComponent", () => {
    let component: ReadmeSectionComponent;
    let fixture: ComponentFixture<ReadmeSectionComponent>;
    let datasetCommitService: DatasetCommitService;
    let loggedUserService: LoggedUserService;

    const mockReadmeContent = "Mock README.md content";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, MarkdownModule.forRoot(), ReadmeSectionComponent],
            providers: [Apollo, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(ReadmeSectionComponent);
        component = fixture.componentInstance;
        datasetCommitService = TestBed.inject(DatasetCommitService);
        loggedUserService = TestBed.inject(LoggedUserService);
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        component.currentReadme = mockReadmeContent;
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check show select tab", () => {
        fixture.detectChanges();
        expect(component.editingInProgress).toEqual(false);
        emitClickOnElementByDataTestId(fixture, "show-edit-tabs");
        fixture.detectChanges();
        expect(component.editingInProgress).toEqual(true);
    });

    it("should check switch edit/preview mode", () => {
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "show-edit-tabs");
        fixture.detectChanges();
        expect(component.viewMode).toEqual(EditMode.Edit);
        emitClickOnElementByDataTestId(fixture, "select-preview-tab");
        expect(component.viewMode).toEqual(EditMode.Preview);
        emitClickOnElementByDataTestId(fixture, "select-edit-tab");
        expect(component.viewMode).toEqual(EditMode.Edit);
    });

    it("should check push button 'cancel changes' when currentReadme exist", () => {
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "show-edit-tabs");
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "cancel-changes");
        expect(component.readmeState).toEqual(mockReadmeContent);
    });

    it("should check push button 'cancel changes' when currentReadme is not exist", () => {
        fixture.detectChanges();
        component.currentReadme = null;
        emitClickOnElementByDataTestId(fixture, "show-edit-tabs");
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "cancel-changes");
        expect(component.readmeState).toEqual("");
    });

    it("should check save changes", fakeAsync(() => {
        fixture.detectChanges();
        component.readmeState = mockReadmeContent + "modified";
        const updateReadmeSpy = spyOn(datasetCommitService, "updateReadme").and.returnValue(of());
        emitClickOnElementByDataTestId(fixture, "show-edit-tabs");
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "save-changes");
        tick();
        expect(updateReadmeSpy).toHaveBeenCalledTimes(1);
        flush();
    }));

    it("should check readme updated in the onChanges hook", () => {
        const modifiedReadmeContent = mockReadmeContent + "modified";
        const readmeSimpleChanges: SimpleChanges = {
            currentReadme: {
                previousValue: mockReadmeContent,
                currentValue: modifiedReadmeContent,
                firstChange: false,
                isFirstChange: () => false,
            },
        };
        component.ngOnChanges(readmeSimpleChanges);
        expect(component.readmeState).toEqual(modifiedReadmeContent);
    });

    it("should check Run and Copy buttons exist", async () => {
        component.readmeState = "```sql" + "\nselect * from 'account.tokens.portfolio.market-value'" + "\n```";
        component.viewMode = EditMode.Preview;
        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();
        const copyButtonElement = findNativeElement(fixture, `.markdown-clipboard-button`);
        expect(copyButtonElement).toBeDefined();

        const runButtonElement = findNativeElement(fixture, `.markdown-run-button`);
        expect(runButtonElement).toBeDefined();
    });

    it("should check Run button navigate to Data tab", async () => {
        component.readmeState = "```sql" + "\nselect * from 'account.tokens.portfolio.market-value'" + "\n```";
        component.viewMode = EditMode.Preview;

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const runButtonElement = findNativeElement(fixture, `.markdown-run-button`) as HTMLLinkElement;
        expect(
            runButtonElement.href.includes(
                "kamu/mockNameDerived/data?sqlQuery=select%20*%20from%20%27account.tokens.portfolio.market-value%27",
            ),
        ).toBeTrue();
    });

    it("should check Run button navigate to Data tab with line breaks", async () => {
        component.readmeState = "```sql" + "\nselect\n*\nfrom 'account.tokens.portfolio.market-value'" + "\n```";
        component.viewMode = EditMode.Preview;

        fixture.detectChanges();
        await fixture.whenStable();
        fixture.detectChanges();

        const runButtonElement = findNativeElement(fixture, `.markdown-run-button`) as HTMLLinkElement;
        expect(
            runButtonElement.href.includes(
                "kamu/mockNameDerived/data?sqlQuery=select%0A*%0Afrom%20%27account.tokens.portfolio.market-value%27",
            ),
        ).toBeTrue();
    });
});
