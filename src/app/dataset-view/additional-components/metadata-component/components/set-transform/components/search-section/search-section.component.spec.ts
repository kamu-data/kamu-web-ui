import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchSectionComponent } from "./search-section.component";

describe("SearchSectionComponent", () => {
    let component: SearchSectionComponent;
    let fixture: ComponentFixture<SearchSectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchSectionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
