import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    tick,
} from "@angular/core/testing";
import { ReadmeSectionComponent } from "./readme-section.component";
import { mockDatasetBasicsFragment } from "src/app/search/mock.data";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { DatasetCommitService } from "../../services/dataset-commit.service";
import { SecurityContext } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MarkdownModule } from "ngx-markdown";
import { emitClickOnElementByDataTestId } from "src/app/common/base-test.helpers.spec";
import { EditMode } from "./readme-section.types";
import { of } from "rxjs";

describe("ReadmeSectionComponent", () => {
    let component: ReadmeSectionComponent;
    let fixture: ComponentFixture<ReadmeSectionComponent>;
    let datasetCommitService: DatasetCommitService;

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
        component.datasetBasics = mockDatasetBasicsFragment;
        component.currentReadme = mockReadmeContent;

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check show select tab", () => {
        expect(component.editViewShow).toEqual(false);
        emitClickOnElementByDataTestId(fixture, "show-edit-tabs");
        fixture.detectChanges();
        expect(component.editViewShow).toEqual(true);
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
        const updateReadmeSpy = spyOn(
            datasetCommitService,
            "updateReadme",
        ).and.returnValue(of());
        emitClickOnElementByDataTestId(fixture, "show-edit-tabs");
        fixture.detectChanges();
        emitClickOnElementByDataTestId(fixture, "save-changes");
        tick();
        expect(updateReadmeSpy).toHaveBeenCalledTimes(1);
    }));
});
