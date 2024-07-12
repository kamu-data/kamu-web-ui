import { MatTableModule } from "@angular/material/table";
import { ToastrModule } from "ngx-toastr";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsSecretsManagerTabComponent } from "./dataset-settings-secrets-manager-tab.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { PaginationComponent } from "src/app/components/pagination-component/pagination.component";
import { AngularSvgIconModule } from "angular-svg-icon";
import { MatDividerModule } from "@angular/material/divider";
import { HttpClientModule } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { FormsModule } from "@angular/forms";

describe("DatasetSettingsSecretsManagerTabComponent", () => {
    let component: DatasetSettingsSecretsManagerTabComponent;
    let fixture: ComponentFixture<DatasetSettingsSecretsManagerTabComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetSettingsSecretsManagerTabComponent, PaginationComponent],
            providers: [
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "page":
                                            return 2;
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
                                    }
                                },
                            },
                        },
                    },
                },
            ],
            imports: [
                ToastrModule.forRoot(),
                ApolloTestingModule,
                AngularSvgIconModule.forRoot(),
                MatDividerModule,
                MatTableModule,
                HttpClientModule,
                MatIconModule,
                FormsModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(DatasetSettingsSecretsManagerTabComponent);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
