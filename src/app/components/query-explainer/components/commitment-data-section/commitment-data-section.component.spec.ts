import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommitmentDataSectionComponent } from "./commitment-data-section.component";

describe("CommitmentDataSectionComponent", () => {
    let component: CommitmentDataSectionComponent;
    let fixture: ComponentFixture<CommitmentDataSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [CommitmentDataSectionComponent],
        });
        fixture = TestBed.createComponent(CommitmentDataSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
