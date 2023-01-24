import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NavigationService } from "src/app/services/navigation.service";

import { OwnerPropertyComponent } from "./owner-property.component";

describe("OwnerPropertyComponent", () => {
    let component: OwnerPropertyComponent;
    let fixture: ComponentFixture<OwnerPropertyComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OwnerPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OwnerPropertyComponent);
        component = fixture.componentInstance;
        component.data = { id: "1", name: "kamu" };
        navigationService = TestBed.inject(NavigationService);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check navigate to owner page", () => {
        const navigateToOwnerViewSpy = spyOn(
            navigationService,
            "navigateToOwnerView",
        );
        const name = component.data.name;
        component.showOwner();
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(name);
    });
});
