import { ComponentFixture, TestBed } from "@angular/core/testing";
import { VerifyResultSectionComponent } from "./verify-result-section.component";

describe("VerifyResultSectionComponent", () => {
    let component: VerifyResultSectionComponent;
    let fixture: ComponentFixture<VerifyResultSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [VerifyResultSectionComponent],
        });
        fixture = TestBed.createComponent(VerifyResultSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
