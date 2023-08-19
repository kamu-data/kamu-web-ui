import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NavigationService } from "src/app/services/navigation.service";
import { OwnerPropertyComponent } from "./owner-property.component";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { AccountBasicsFragment } from "src/app/api/kamu.graphql.interface";

describe("OwnerPropertyComponent", () => {
    let component: OwnerPropertyComponent;
    let fixture: ComponentFixture<OwnerPropertyComponent>;
    let navigationService: NavigationService;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OwnerPropertyComponent],
            imports: [SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(OwnerPropertyComponent);
        component = fixture.componentInstance;
        component.data = { id: "1", accountName: "kamu" } as AccountBasicsFragment;
        navigationService = TestBed.inject(NavigationService);

        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check navigate to owner page", () => {
        const navigateToOwnerViewSpy = spyOn(navigationService, "navigateToOwnerView");
        const name = component.data.accountName;
        component.showOwner();
        expect(navigateToOwnerViewSpy).toHaveBeenCalledWith(name);
    });
});
