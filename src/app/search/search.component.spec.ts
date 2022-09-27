import { DatasetInfo } from "./../interface/navigation.interface";
import { AuthApi } from "./../api/auth.api";
import { SearchApi } from "./../api/search.api";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchComponent } from "./search.component";
import { NavigationService } from "../services/navigation.service";
import { AppSearchService } from "./search.service";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ModalService } from "../components/modal/modal.service";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { RouterTestingModule } from "@angular/router/testing";

describe("SearchComponent", () => {
    let component: SearchComponent;
    let fixture: ComponentFixture<SearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchComponent],
            imports: [ApolloTestingModule, RouterTestingModule],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                NavigationService,
                AppSearchService,
                AuthApi,
                SearchApi,
                ModalService,
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", async () => {
        await expect(component).toBeTruthy();
    });

    it("should call updateAllComplete method", async () => {
        component.updateAllComplete();
        await expect(component["allComplete"]).toEqual(false);
    });

    it("should check call navigateToDatasetView in navigation service", async () => {
        const data: DatasetInfo = {
            accountName: "test",
            datasetName: "test datasetName",
        };
        const routerSpy = spyOn(
            component["navigationService"],
            "navigateToDatasetView",
        );
        component.onSelectDataset(data);
        await expect(routerSpy).toHaveBeenCalled();
    });

    it("should check onPageChange method with page", async () => {
        const testSearchValue = "test";
        const testCurrentPage = 2;
        component.searchValue = testSearchValue;
        fixture.detectChanges();
        const navigationServiceSpy = spyOn(
            component["navigationService"],
            "navigateToSearch",
        );
        component.onPageChange({
            currentPage: testCurrentPage,
            isClick: false,
        });
        await expect(component.currentPage).toBe(testCurrentPage);
        expect(navigationServiceSpy).toHaveBeenCalledWith(
            testSearchValue,
            testCurrentPage,
        );
    });

    it("should check onPageChange method when page equal 0", async () => {
        const testSearchValue = "test";
        component.searchValue = testSearchValue;
        fixture.detectChanges();
        const navigationServiceSpy = spyOn(
            component["navigationService"],
            "navigateToSearch",
        );
        component.onPageChange({ currentPage: 0, isClick: false });
        await expect(component.currentPage).toBe(1);
        expect(navigationServiceSpy).toHaveBeenCalledWith(testSearchValue);
    });
});
