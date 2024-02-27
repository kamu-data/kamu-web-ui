import { Apollo, ApolloModule } from "apollo-angular";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetFlowDetailsComponent } from "./dataset-flow-details.component";
import { ActivatedRoute } from "@angular/router";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ToastrModule } from "ngx-toastr";
import { of } from "rxjs";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { DatasetViewHeaderComponent } from "src/app/dataset-view/dataset-view-header/dataset-view-header.component";
import { FlowDetailsHistoryTabComponent } from "./tabs/flow-details-history-tab/flow-details-history-tab.component";
import { SearchAdditionalButtonsComponent } from "src/app/components/search-additional-buttons/search-additional-buttons.component";
import { SearchAdditionalButtonsNavComponent } from "src/app/components/search-additional-buttons/search-additional-buttons-nav.component";
import { MatMenuModule } from "@angular/material/menu";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { AngularSvgIconModule } from "angular-svg-icon";

describe("DatasetFlowDetailsComponent", () => {
    let component: DatasetFlowDetailsComponent;
    let fixture: ComponentFixture<DatasetFlowDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                DatasetFlowDetailsComponent,
                DatasetViewHeaderComponent,
                FlowDetailsHistoryTabComponent,
                SearchAdditionalButtonsComponent,
                SearchAdditionalButtonsNavComponent,
            ],
            providers: [
                {
                    Apollo,
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            params: of({
                                accountName: "accountName",
                                datasetName: "datasetName",
                            }),
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "tab":
                                            return "flows";
                                    }
                                },
                            },
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return "accountName";
                                        case "datasetName":
                                            return "datasetName";
                                        case "flow-id":
                                            return "1";
                                        case "category":
                                            return "history";
                                    }
                                },
                            },
                        },
                    },
                },
            ],
            imports: [
                ApolloTestingModule,
                ApolloModule,
                MatDividerModule,
                MatIconModule,
                MatMenuModule,
                ToastrModule.forRoot(),
                AngularSvgIconModule.forRoot(),
                HttpClientTestingModule,
                NgbPopoverModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetFlowDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
