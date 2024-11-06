import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DataAccessCodeTabComponent } from "./data-access-code-tab.component";

describe("DataAccessCodeTabComponent", () => {
    let component: DataAccessCodeTabComponent;
    let fixture: ComponentFixture<DataAccessCodeTabComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DataAccessCodeTabComponent],
        });
        fixture = TestBed.createComponent(DataAccessCodeTabComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
