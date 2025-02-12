import { ChangeDetectionStrategy } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SearchAdditionalButtonsNavComponent } from "./search-additional-buttons-nav.component";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { registerMatSvgIcons } from "src/app/common/helpers/base-test.helpers.spec";
import { FeatureFlagModule } from "../../directives/feature-flag.module";
import { searchAdditionalButtonsEnum } from "src/app/search/search.interface";

describe("SearchAdditionalButtonsNavComponent", () => {
    let component: SearchAdditionalButtonsNavComponent;
    let fixture: ComponentFixture<SearchAdditionalButtonsNavComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchAdditionalButtonsNavComponent],
            imports: [MatIconModule, MatMenuModule, FeatureFlagModule],
        })
            .overrideComponent(SearchAdditionalButtonsNavComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        registerMatSvgIcons();

        fixture = TestBed.createComponent(SearchAdditionalButtonsNavComponent);
        component = fixture.componentInstance;
        component.searchAdditionalButtonsData = [
            {
                id: "search.starred",
                textButton: searchAdditionalButtonsEnum.Starred,
                counter: 2,
                iconSvgPath:
                    "M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z",
                svgClass: "octicon octicon-star-fill starred-button-icon d-inline-block mr-2",
                iconSvgPathClass: "starred-button-icon",
            },
        ];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
