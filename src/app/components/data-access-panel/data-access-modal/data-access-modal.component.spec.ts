import { DataAccessLinkTabComponent } from "./tabs/data-access-link-tab/data-access-link-tab.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataAccessModalComponent } from "./data-access-modal.component";
import { Apollo, ApolloModule } from "apollo-angular";
import { of } from "rxjs";
import { mockDatasetEndPoints } from "../data-access-panel-mock.data";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormsModule } from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AngularSvgIconModule } from "angular-svg-icon";
import { ApolloTestingModule } from "apollo-angular/testing";
import { DataAccessKamuCliTabComponent } from "./tabs/data-access-kamu-cli-tab/data-access-kamu-cli-tab.component";
import { DataAccessRestTabComponent } from "./tabs/data-access-rest-tab/data-access-rest-tab.component";
import { DataAccessSqlTabComponent } from "./tabs/data-access-sql-tab/data-access-sql-tab.component";
import { DataAccessStreamTabComponent } from "./tabs/data-access-stream-tab/data-access-stream-tab.component";
import { DataAccessCodeTabComponent } from "./tabs/data-access-code-tab/data-access-code-tab.component";
import { DataAccessOdataTabComponent } from "./tabs/data-access-odata-tab/data-access-odata-tab.component";
import { DataAccessExportTabComponent } from "./tabs/data-access-export-tab/data-access-export-tab.component";

describe("DataAccessModalComponent", () => {
    let component: DataAccessModalComponent;
    let fixture: ComponentFixture<DataAccessModalComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [Apollo],
            declarations: [
                DataAccessModalComponent,
                DataAccessLinkTabComponent,
                DataAccessKamuCliTabComponent,
                DataAccessRestTabComponent,
                DataAccessSqlTabComponent,
                DataAccessStreamTabComponent,
                DataAccessCodeTabComponent,
                DataAccessOdataTabComponent,
                DataAccessExportTabComponent,
            ],
            imports: [
                FormsModule,
                MatDividerModule,
                MatCheckboxModule,
                MatIconModule,
                MatTooltipModule,
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                BrowserAnimationsModule,
                ApolloModule,
                ApolloTestingModule,
            ],
        });
        fixture = TestBed.createComponent(DataAccessModalComponent);
        component = fixture.componentInstance;
        component.protocols$ = of(mockDatasetEndPoints);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
