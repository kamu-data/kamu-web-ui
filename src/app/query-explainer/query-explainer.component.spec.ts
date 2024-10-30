import { CommitmentDataSectionComponent } from "./components/commitment-data-section/commitment-data-section.component";
import { InputDataSectionComponent } from "./components/input-data-section/input-data-section.component";
import { VerifyResultSectionComponent } from "./components/verify-result-section/verify-result-section.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { QueryExplainerComponent } from "./query-explainer.component";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { of } from "rxjs";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { Apollo } from "apollo-angular";
import { QueryExplainerService } from "./query-explainer.service";
import {
    mockQueryExplainerResponse,
    mockTextareaCommitment,
    mockVerifyQueryResponseSuccess,
} from "./query-explainer.mocks";
import ProjectLinks from "src/app/project-links";
import { HIGHLIGHT_OPTIONS, HighlightModule } from "ngx-highlightjs";
import { AngularSvgIconModule } from "angular-svg-icon";
import { ReproducedResultSectionComponent } from "./components/reproduced-result-section/reproduced-result-section.component";
import { DisplayHashModule } from "../components/display-hash/display-hash.module";
import { DynamicTableModule } from "../components/dynamic-table/dynamic-table.module";
import { DatasetService } from "../dataset-view/dataset.service";
import { mockDatasetByIdQuery } from "../api/mock/dataset.mock";
import { checkButtonDisabled, emitClickOnElementByDataTestId, setFieldValue } from "../common/base-test.helpers.spec";
import { FormsModule } from "@angular/forms";

describe("QueryExplainerComponent", () => {
    let component: QueryExplainerComponent;
    let fixture: ComponentFixture<QueryExplainerComponent>;
    let queryExplainerService: QueryExplainerService;
    let datasetService: DatasetService;
    let toastrService: ToastrService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                QueryExplainerComponent,
                VerifyResultSectionComponent,
                ReproducedResultSectionComponent,
                InputDataSectionComponent,
                CommitmentDataSectionComponent,
            ],
            imports: [
                HttpClientTestingModule,
                DynamicTableModule,
                AngularSvgIconModule.forRoot(),
                ToastrModule.forRoot(),
                DisplayHashModule,
                HighlightModule,
                RouterModule,
                FormsModule,
            ],
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case ProjectLinks.URL_QUERY_PARAM_COMMITMENT_UPLOAD_TOKEN:
                                            return "";
                                    }
                                },
                            },
                        },
                    },
                },

                {
                    provide: HIGHLIGHT_OPTIONS,
                    useValue: {
                        coreLibraryLoader: () => import("highlight.js/lib/core"),
                        languages: {
                            sql: () => import("highlight.js/lib/languages/sql"),
                        },
                    },
                },
            ],
        });
        datasetService = TestBed.inject(DatasetService);
        toastrService = TestBed.inject(ToastrService);
        queryExplainerService = TestBed.inject(QueryExplainerService);
        spyOn(queryExplainerService, "verifyQuery").and.returnValue(of(mockVerifyQueryResponseSuccess));
        spyOn(queryExplainerService, "fetchCommitmentDataByUploadToken").and.returnValue(
            of(mockQueryExplainerResponse),
        );
        spyOn(datasetService, "requestDatasetInfoById").and.returnValue(of(mockDatasetByIdQuery));
        fixture = TestBed.createComponent(QueryExplainerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check `Verify commitment` button is disabled", () => {
        fixture.detectChanges();
        checkButtonDisabled(fixture, "verify-commitment-button", true);
    });

    it("should check error message when commitment is incorrect", () => {
        const toastrServiceErrorSpy = spyOn(toastrService, "error");
        setFieldValue(fixture, "input-textarea", "incorrect commitment");
        fixture.detectChanges();

        emitClickOnElementByDataTestId(fixture, "verify-commitment-button");
        expect(toastrServiceErrorSpy).toHaveBeenCalledWith("Impossible to parse the commitment");
    });

    it("should check text area is not empty", () => {
        fixture.detectChanges();
        setFieldValue(fixture, "input-textarea", mockTextareaCommitment);
        fixture.detectChanges();
        expect(component.commitment).toEqual(mockTextareaCommitment);
    });
});
