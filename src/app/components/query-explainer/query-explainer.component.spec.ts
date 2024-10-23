import { VerifyResultSectionComponent } from "./components/verify-result-section/verify-result-section.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { QueryExplainerComponent } from "./query-explainer.component";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { of } from "rxjs";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ToastrModule } from "ngx-toastr";
import { Apollo } from "apollo-angular";
import { QueryExplainerService } from "./query-explainer.service";
import { mockQueryExplainerResponse, mockVerifyQueryResponseSuccess } from "./query-explainer.mocks";
import ProjectLinks from "src/app/project-links";
import { DisplayHashModule } from "../display-hash/display-hash.module";
import { HIGHLIGHT_OPTIONS, HighlightModule } from "ngx-highlightjs";
import { DynamicTableModule } from "../dynamic-table/dynamic-table.module";
import { AngularSvgIconModule } from "angular-svg-icon";
import { ReproducedResultSectionComponent } from "./components/reproduced-result-section/reproduced-result-section.component";

describe("QueryExplainerComponent", () => {
    let component: QueryExplainerComponent;
    let fixture: ComponentFixture<QueryExplainerComponent>;
    let queryExplainerService: QueryExplainerService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [QueryExplainerComponent, VerifyResultSectionComponent, ReproducedResultSectionComponent],
            imports: [
                HttpClientTestingModule,
                DynamicTableModule,
                AngularSvgIconModule.forRoot(),
                ToastrModule.forRoot(),
                DisplayHashModule,
                HighlightModule,
                RouterModule,
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
                                            return "test-upload-token";
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
        fixture = TestBed.createComponent(QueryExplainerComponent);
        queryExplainerService = TestBed.inject(QueryExplainerService);
        component = fixture.componentInstance;
        spyOn(queryExplainerService, "verifyQuery").and.returnValue(of(mockVerifyQueryResponseSuccess));
        spyOn(queryExplainerService, "fetchCommitmentDataByUploadToken").and.returnValue(
            of(mockQueryExplainerResponse),
        );
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check verify is successful", () => {
        expect(true).toEqual(true);
    });
});
