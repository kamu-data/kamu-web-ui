import { ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SearchAdditionalButtonsNavComponent } from "./search-additional-buttons-nav.component";

import { SearchAdditionalButtonsComponent } from "./search-additional-buttons.component";

describe("SearchAdditionalButtonsComponent", () => {
    let component: SearchAdditionalButtonsComponent;
    let fixture: ComponentFixture<SearchAdditionalButtonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchAdditionalButtonsComponent, SearchAdditionalButtonsNavComponent],
            providers: [],
        })
            .overrideComponent(SearchAdditionalButtonsComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(SearchAdditionalButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should trigger onResize method when window is resized", () => {
        const spyOnResize = spyOn(component, "checkWindowSize");
        window.dispatchEvent(new Event("resize"));
        fixture.detectChanges();
        expect(spyOnResize).toHaveBeenCalledWith();
    });
});
