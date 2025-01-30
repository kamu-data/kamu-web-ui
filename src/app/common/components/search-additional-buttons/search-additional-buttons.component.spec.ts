import { ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SearchAdditionalButtonsNavComponent } from "./search-additional-buttons-nav.component";
import { SearchAdditionalButtonsComponent } from "./search-additional-buttons.component";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { SharedModule } from "src/app/shared/shared/shared.module";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";

describe("SearchAdditionalButtonsComponent", () => {
    let component: SearchAdditionalButtonsComponent;
    let fixture: ComponentFixture<SearchAdditionalButtonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchAdditionalButtonsComponent, SearchAdditionalButtonsNavComponent],
            imports: [MatIconModule, MatMenuModule, SharedModule],
        })
            .overrideComponent(SearchAdditionalButtonsComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        registerMatSvgIcons();

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
