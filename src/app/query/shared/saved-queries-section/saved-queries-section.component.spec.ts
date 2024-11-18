import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SavedQueriesSectionComponent } from "./saved-queries-section.component";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { MatIconModule } from "@angular/material/icon";

describe("SavedQueriesSectionComponent", () => {
    let component: SavedQueriesSectionComponent;
    let fixture: ComponentFixture<SavedQueriesSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SavedQueriesSectionComponent],
            imports: [CdkAccordionModule, MatIconModule],
        });
        fixture = TestBed.createComponent(SavedQueriesSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
