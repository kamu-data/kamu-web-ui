import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SavedQueriesSectionComponent } from "./saved-queries-section.component";

describe("SavedQueriesSectionComponent", () => {
    let component: SavedQueriesSectionComponent;
    let fixture: ComponentFixture<SavedQueriesSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SavedQueriesSectionComponent],
        });
        fixture = TestBed.createComponent(SavedQueriesSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
