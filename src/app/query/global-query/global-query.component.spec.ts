/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SavedQueriesSectionComponent } from "../shared/saved-queries-section/saved-queries-section.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GlobalQueryComponent } from "./global-query.component";
import { EditorModule } from "src/app/editor/editor.module";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { QueryAndResultSectionsComponent } from "src/app/query/shared/query-and-result-sections/query-and-result-sections.component";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { MatMenuModule } from "@angular/material/menu";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { provideToastr } from "ngx-toastr";
import { RequestTimerComponent } from "src/app/query/shared/request-timer/request-timer.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { MatDividerModule } from "@angular/material/divider";
import { FormsModule } from "@angular/forms";
import { SearchAndSchemasSectionComponent } from "./search-and-schemas-section/search-and-schemas-section.component";
import { SqlQueryService } from "src/app/services/sql-query.service";
import { of } from "rxjs";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { NavigationService } from "src/app/services/navigation.service";
import { EngineSelectComponent } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/components/engine-select/engine-select.component";
import { EngineService } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/components/engine-section/engine.service";
import { mockEngines } from "src/app/dataset-view/additional-components/metadata-component/components/set-transform/mock.data";
import { provideAnimations } from "@angular/platform-browser/animations";

describe("GlobalQueryComponent", () => {
    let component: GlobalQueryComponent;
    let fixture: ComponentFixture<GlobalQueryComponent>;
    let sqlQueryService: SqlQueryService;
    let navigationService: NavigationService;
    let engineService: EngineService;
    const SQL_QUERY = "select * from 'datasetName'";

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                EditorModule,
                HttpClientTestingModule,
                MatMenuModule,
                MatProgressBarModule,
                CdkAccordionModule,
                MatIconModule,
                NgbTypeaheadModule,
                MatDividerModule,
                FormsModule,
                SharedTestModule,
                GlobalQueryComponent,
                SavedQueriesSectionComponent,
                RequestTimerComponent,
                QueryAndResultSectionsComponent,
                SearchAndSchemasSectionComponent,
                EngineSelectComponent,
            ],
            providers: [Apollo, provideAnimations(), provideToastr()],
        });
        fixture = TestBed.createComponent(GlobalQueryComponent);
        component = fixture.componentInstance;
        component.sqlQuery = SQL_QUERY;
        sqlQueryService = TestBed.inject(SqlQueryService);
        navigationService = TestBed.inject(NavigationService);
        engineService = TestBed.inject(EngineService);
        spyOn(engineService, "engines").and.returnValue(of(mockEngines));
        spyOn(navigationService, "navigateToDatasetView");
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check init sql request code ", () => {
        component.ngOnInit();
        expect(component.sqlRequestCode).toEqual(SQL_QUERY);
    });

    it("should check run sql request code ", () => {
        const requestDataSqlRunSpy = spyOn(sqlQueryService, "requestDataSqlRun").and.returnValue(of());
        component.runSQLRequest({ query: SQL_QUERY });
        expect(requestDataSqlRunSpy).toHaveBeenCalledWith(jasmine.objectContaining({ query: SQL_QUERY }));
    });
});
