import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SideNavService } from "src/app/services/sidenav.service";
import { SearchAdditionalButtonsNavComponent } from "./search-additional-buttons-nav.component";

import { SearchAdditionalButtonsComponent } from "./search-additional-buttons.component";

describe("SearchAdditionalButtonsComponent", () => {
    let component: SearchAdditionalButtonsComponent;
    let fixture: ComponentFixture<SearchAdditionalButtonsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                SearchAdditionalButtonsComponent,
                SearchAdditionalButtonsNavComponent,
            ],
            providers: [SideNavService],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchAdditionalButtonsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", async () => {
        await expect(component).toBeTruthy();
    });
});
