import { ComponentFixture, TestBed, fakeAsync, flush, tick } from "@angular/core/testing";
import { ReadmeSectionComponent } from "./readme-section.component";
import { mockDatasetBasicsDerivedFragment } from "src/app/search/mock.data";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { DatasetCommitService } from "../../services/dataset-commit.service";
import { SecurityContext, SimpleChanges } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MarkdownModule } from "ngx-markdown";
import { emitClickOnElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { EditMode } from "./readme-section.types";
import { of } from "rxjs";
import { LoggedUserService } from "src/app/auth/logged-user.service";
import { mockAccountDetails } from "src/app/api/mock/auth.mock";

describe("ReadmeSectionComponent", () => {
    let component: ReadmeSectionComponent;
    let fixture: ComponentFixture<ReadmeSectionComponent>;
    let datasetCommitService: DatasetCommitService;
    let loggedUserService: LoggedUserService;

    const mockReadmeContent = "Mock README.md content";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [Apollo],
            declarations: [ReadmeSectionComponent],
            imports: [
                ApolloModule,
                ApolloTestingModule,
                SharedTestModule,
                MarkdownModule.forRoot({
                    loader: HttpClient,
                    sanitize: SecurityContext.NONE,
                }),
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                FormsModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ReadmeSectionComponent);
        component = fixture.componentInstance;
        datasetCommitService = TestBed.inject(DatasetCommitService);
        loggedUserService = TestBed.inject(LoggedUserService);
        component.datasetBasics = mockDatasetBasicsDerivedFragment;
        component.currentReadme = mockReadmeContent;
        spyOnProperty(loggedUserService, "currentlyLoggedInUser", "get").and.returnValue(mockAccountDetails);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check show select tab", () => {
        expect(component.editingInProgress).toEqual(false);
        emitClickOnElementByDataTestId(fixture, "show-edit-tabs");
        fixture.detectChanges();
        expect(component.editingInProgress).toEqual(true);
    });

    it("should check switch edit/preview mode", () => {
        emitClickOnElementByDataTestId(fixture, "show-edit-tabs");
        fixture.detectChanges();
        expect(component.viewMode).toEqual(EditMode.Edit);
        emitClickOnElementByDataTestId(fixture, "select-preview-tab");
        expect(component.viewMode).toEqual(EditMode.Preview);
        emitClickOnElementByDataTestId(fixture, "select-edit-tab");
        expect(component.viewMode).toEqual(EditMode.Edit);
    });

    it("should check push button 'cancel changes' when currentReadme exist", () => {
        emitClickOnElementByDataTestId(fixture, "show-edit-tabs");
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "cancel-changes");
        expect(component.readmeState).toEqual(mockReadmeContent);
    });

    it("should check push button 'cancel changes' when currentReadme is not exist", () => {
        component.currentReadme = null;
        emitClickOnElementByDataTestId(fixture, "show-edit-tabs");
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "cancel-changes");
        expect(component.readmeState).toEqual("");
    });

    it("should check save changes", fakeAsync(() => {
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
});
