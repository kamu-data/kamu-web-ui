import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PageNotFoundComponent } from "./page-not-found.component";

describe("PageNotFoundComponent", () => {
    let component: PageNotFoundComponent;
    let fixture: ComponentFixture<PageNotFoundComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PageNotFoundComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(PageNotFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", async () => {
        await expect(component).toBeTruthy();
    });

    it("should redirect to home page", async () => {
        const navigateToHomeSpy = spyOn(
            component["navigationService"],
            "navigateToHome",
        ).and.returnValue();
        component.navigateToNome();
        await expect(navigateToHomeSpy).toHaveBeenCalled();
    });
});
