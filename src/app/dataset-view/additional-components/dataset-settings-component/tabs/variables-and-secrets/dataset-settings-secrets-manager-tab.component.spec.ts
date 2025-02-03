import { MatTableModule } from "@angular/material/table";
import { ToastrModule } from "ngx-toastr";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DatasetSettingsSecretsManagerTabComponent } from "./dataset-settings-secrets-manager-tab.component";
import { Apollo } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { PaginationComponent } from "src/app/common/components/pagination-component/pagination.component";
import { MatDividerModule } from "@angular/material/divider";
import { HttpClientModule } from "@angular/common/http";
import { ActivatedRoute } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { mockDatasetBasicsRootFragment } from "src/app/search/mock.data";
import { FormBuilder, FormsModule } from "@angular/forms";
import { NavigationService } from "src/app/services/navigation.service";
import { DatasetEvnironmentVariablesService } from "src/app/services/dataset-evnironment-variables.service";
import { of } from "rxjs";
import { MOCK_ENV_VAR_ID, mockListEnvVariablesQuery } from "src/app/api/mock/environment-variables-and-secrets.mock";
import { ViewDatasetEnvVarConnection } from "src/app/api/kamu.graphql.interface";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ModalService } from "src/app/common/components/modal/modal.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";

describe("DatasetSettingsSecretsManagerTabComponent", () => {
    let component: DatasetSettingsSecretsManagerTabComponent;
    let fixture: ComponentFixture<DatasetSettingsSecretsManagerTabComponent>;
    let navigationService: NavigationService;
    let evnironmentVariablesService: DatasetEvnironmentVariablesService;
    let ngbModalService: NgbModal;
    let modalService: ModalService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [DatasetSettingsSecretsManagerTabComponent, PaginationComponent],
            providers: [
                FormBuilder,
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
                MatDividerModule,
                MatTableModule,
                HttpClientModule,
                MatIconModule,
                FormsModule,
                MatTooltipModule,
            ],
        }).compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(DatasetSettingsSecretsManagerTabComponent);
        navigationService = TestBed.inject(NavigationService);
        evnironmentVariablesService = TestBed.inject(DatasetEvnironmentVariablesService);
        ngbModalService = TestBed.inject(NgbModal);
        modalService = TestBed.inject(ModalService);
        component = fixture.componentInstance;
        component.datasetBasics = mockDatasetBasicsRootFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check change page", () => {
        expect(component.currentPage).toEqual(2);
        const navigateToDatasetViewSpy = spyOn(navigationService, "navigateToDatasetView");
        const listEnvVariablesSpy = spyOn(evnironmentVariablesService, "listEnvVariables").and.returnValue(
            of(
                mockListEnvVariablesQuery.datasets.byOwnerAndName?.envVars
                    .listEnvVariables as ViewDatasetEnvVarConnection,
            ),
        );

        component.onPageChange(3);
        expect(navigateToDatasetViewSpy).toHaveBeenCalledWith(jasmine.objectContaining({ page: 3 }));
        expect(component.currentPage).toEqual(3);
        expect(listEnvVariablesSpy).toHaveBeenCalledTimes(1);
    });

    it("should check refresh search", () => {
        component.searchByKey = "mock-key";
        component.refreshSearchByKey();
        expect(component.searchByKey).toEqual("");
        expect(component.dataSource.filter).toEqual("");
    });

    it("should check apply filter", () => {
        const testSearch = "Test";
        component.applyFilter(testSearch);
        expect(component.dataSource.filter).toEqual(testSearch.toLowerCase());
    });

    it("should check delete env variable", () => {
        const modalWindowSpy = spyOn(modalService, "error").and.callFake((options) => {
            options.handler?.call(undefined, true);
            return Promise.resolve("");
        });
        const deleteEnvVariableSpy = spyOn(evnironmentVariablesService, "deleteEnvVariable").and.callThrough();
        component.onDelete(MOCK_ENV_VAR_ID);
        expect(modalWindowSpy).toHaveBeenCalledTimes(1);
        expect(deleteEnvVariableSpy).toHaveBeenCalledTimes(1);
    });

    it("should check add env variable", () => {
        const ngbModalServiceOpenSpy = spyOn(ngbModalService, "open").and.callThrough();
        component.onAddOrEditRow();
        expect(ngbModalServiceOpenSpy).toHaveBeenCalledTimes(1);
    });
});
