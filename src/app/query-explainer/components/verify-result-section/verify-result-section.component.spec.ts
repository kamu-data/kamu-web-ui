import { ComponentFixture, TestBed } from "@angular/core/testing";
import { VerifyResultSectionComponent } from "./verify-result-section.component";
import { mockVerifyQueryResponseSuccess } from "../../query-explainer.mocks";
import { MatIconModule } from "@angular/material/icon";

describe("VerifyResultSectionComponent", () => {
    let component: VerifyResultSectionComponent;
    let fixture: ComponentFixture<VerifyResultSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [VerifyResultSectionComponent],
            imports: [MatIconModule],
        });
        fixture = TestBed.createComponent(VerifyResultSectionComponent);
        component = fixture.componentInstance;
        component.verifyResponse = mockVerifyQueryResponseSuccess;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
