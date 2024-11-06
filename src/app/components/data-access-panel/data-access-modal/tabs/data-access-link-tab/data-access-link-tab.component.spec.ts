import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataAccessLinkTabComponent } from "./data-access-link-tab.component";

describe("DataAccessLinkTabComponent", () => {
    let component: DataAccessLinkTabComponent;
    let fixture: ComponentFixture<DataAccessLinkTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DataAccessLinkTabComponent],
        });
        fixture = TestBed.createComponent(DataAccessLinkTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
