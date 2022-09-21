import { AppHeaderComponent } from "./components/app-header/app-header.component";
import { SearchApi } from "./api/search.api";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AppComponent } from "./app.component";
import { AppSearchService } from "./search/search.service";
import { NavigationService } from "./services/navigation.service";
import { AuthApi } from "./api/auth.api";
import { ModalService } from "./components/modal/modal.service";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ModalComponent } from "./components/modal/modal.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

describe("AppComponent", () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, ApolloTestingModule],
            declarations: [AppComponent, AppHeaderComponent, ModalComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
                AppSearchService,
                SearchApi,
                AuthApi,
                NavigationService,
                ModalService,
            ],
        }).compileComponents();
    });

    it("should create the app", async () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.componentInstance;
        await expect(app).toBeTruthy();
    });

    it(`should have as logo 'kamu-client'`, async () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app: AppComponent = fixture.componentInstance;

        await expect(app.appLogo).toEqual("/assets/icons/kamu_logo_icon.svg");
    });
});
