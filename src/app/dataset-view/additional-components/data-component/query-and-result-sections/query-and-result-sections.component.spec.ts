import { ComponentFixture, TestBed } from "@angular/core/testing";
import { QueryAndResultSectionsComponent } from "./query-and-result-sections.component";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { ActivatedRoute } from "@angular/router";
import { Apollo } from "apollo-angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ToastrModule } from "ngx-toastr";
import { MatMenuModule } from "@angular/material/menu";
import { RequestTimerComponent } from "../request-timer/request-timer.component";
import { SqlEditorComponent } from "src/app/shared/editor/components/sql-editor/sql-editor.component";
import { EditorModule } from "src/app/shared/editor/editor.module";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatIconModule } from "@angular/material/icon";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("QueryAndResultSectionsComponent", () => {
    let component: QueryAndResultSectionsComponent;
    let fixture: ComponentFixture<QueryAndResultSectionsComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [QueryAndResultSectionsComponent, RequestTimerComponent, SqlEditorComponent],
            imports: [
                CdkAccordionModule,
                HttpClientTestingModule,
                ToastrModule.forRoot(),
                MatMenuModule,
                MatProgressBarModule,
                EditorModule,
                MatIconModule,
                SharedTestModule,
            ],
            providers: [Apollo],
        });
        fixture = TestBed.createComponent(QueryAndResultSectionsComponent);
        component = fixture.componentInstance;
        component.sqlLoading = false;
        component.sqlRequestCode = "";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
