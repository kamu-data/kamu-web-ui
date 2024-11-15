import { SavedQueriesSectionComponent } from "./../../dataset-view/additional-components/data-component/saved-queries-section/saved-queries-section.component";
import { DynamicTableModule } from "./../../components/dynamic-table/dynamic-table.module";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GlobalQueryComponent } from "./global-query.component";
import { EditorModule } from "src/app/shared/editor/editor.module";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { QueryAndResultSectionsComponent } from "src/app/dataset-view/additional-components/data-component/query-and-result-sections/query-and-result-sections.component";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { ToastrModule } from "ngx-toastr";
import { RequestTimerComponent } from "src/app/dataset-view/additional-components/data-component/request-timer/request-timer.component";
import { ActivatedRoute } from "@angular/router";
import ProjectLinks from "src/app/project-links";
import { MatIconModule } from "@angular/material/icon";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { MatDividerModule } from "@angular/material/divider";
import { FormsModule } from "@angular/forms";
import { SearchAndSchemasSectionComponent } from "./search-and-schemas-section/search-and-schemas-section.component";

describe("GlobalQueryComponent", () => {
    let component: GlobalQueryComponent;
    let fixture: ComponentFixture<GlobalQueryComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                GlobalQueryComponent,
                SavedQueriesSectionComponent,
                RequestTimerComponent,
                QueryAndResultSectionsComponent,
                SearchAndSchemasSectionComponent,
            ],
            imports: [
                EditorModule,
                HttpClientTestingModule,
                ToastrModule.forRoot(),
                MatMenuModule,
                MatProgressBarModule,
                CdkAccordionModule,
                DynamicTableModule,
                MatIconModule,
                NgbTypeaheadModule,
                MatDividerModule,
                FormsModule,
            ],
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return "accountName";
                                        case "datasetName":
                                            return "datasetName";
                                    }
                                },
                            },
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case ProjectLinks.URL_QUERY_PARAM_SQL_QUERY:
                                            return "";
                                    }
                                },
                            },
                        },
                    },
                },
            ],
        });
        fixture = TestBed.createComponent(GlobalQueryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
