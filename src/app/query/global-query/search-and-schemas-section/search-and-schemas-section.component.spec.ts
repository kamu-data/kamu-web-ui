import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SearchAndSchemasSectionComponent } from "./search-and-schemas-section.component";

describe("SearchAndSchemasSectionComponent", () => {
    let component: SearchAndSchemasSectionComponent;
    let fixture: ComponentFixture<SearchAndSchemasSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SearchAndSchemasSectionComponent],
        });
        fixture = TestBed.createComponent(SearchAndSchemasSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
