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
});
