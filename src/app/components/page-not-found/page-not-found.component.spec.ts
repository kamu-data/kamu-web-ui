import { NavigationService } from "src/app/services/navigation.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PageNotFoundComponent } from "./page-not-found.component";

describe("PageNotFoundComponent", () => {
    let component: PageNotFoundComponent;
    let fixture: ComponentFixture<PageNotFoundComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PageNotFoundComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PageNotFoundComponent);
        navigationService = TestBed.inject(NavigationService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", async () => {
        await expect(component).toBeTruthy();
    });

    it("should redirect to home page", async () => {
        const navigateToHomeSpy = spyOn(
            navigationService,
            "navigateToHome",
        ).and.returnValue();
        component.navigateToHome();
        await expect(navigateToHomeSpy).toHaveBeenCalled();
    });
});
