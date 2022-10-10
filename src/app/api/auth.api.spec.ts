import { NavigationService } from "src/app/services/navigation.service";
import { TestBed } from "@angular/core/testing";
import { Apollo } from "apollo-angular";
import { AuthApi } from "./auth.api";
import { AccountDetailsFragment } from "./kamu.graphql.interface";

describe("AuthApi", () => {
    let service: AuthApi;
    let navigationService: NavigationService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [AuthApi, Apollo],
        });
        service = TestBed.inject(AuthApi);
        navigationService = TestBed.inject(NavigationService);
    });

    it("should be created", async () => {
        await expect(service).toBeTruthy();
    });

    it("should be logout user", async () => {
        const navigationServiceSpy = spyOn(navigationService, "navigateToHome");
        const localStorageSpy = spyOn(localStorage, "removeItem");
        const user: AccountDetailsFragment = {
            login: "hhhhhh",
            name: "testName",
        };
        service.userChange(user);
        await expect(service.userModal).toBeDefined();
        service.logOut();
        await expect(service.userModal).toBeNull();
        await expect(localStorageSpy).toHaveBeenCalled();
        await expect(navigationServiceSpy).toHaveBeenCalled();
    });
});
