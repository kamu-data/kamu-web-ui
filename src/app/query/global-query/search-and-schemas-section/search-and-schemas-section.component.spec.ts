import { MatIconModule } from "@angular/material/icon";
import { CdkAccordionModule } from "@angular/cdk/accordion";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SearchAndSchemasSectionComponent } from "./search-and-schemas-section.component";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { Apollo } from "apollo-angular";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { SavedQueriesSectionComponent } from "src/app/dataset-view/additional-components/data-component/saved-queries-section/saved-queries-section.component";
import { MatDividerModule } from "@angular/material/divider";

describe("SearchAndSchemasSectionComponent", () => {
    let component: SearchAndSchemasSectionComponent;
    let fixture: ComponentFixture<SearchAndSchemasSectionComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [SearchAndSchemasSectionComponent, SavedQueriesSectionComponent],
            imports: [
                CdkAccordionModule,
                MatIconModule,
                MatDividerModule,
                SharedTestModule,
                NgbTypeaheadModule,
                FormsModule,
            ],
            providers: [Apollo],
        });
        fixture = TestBed.createComponent(SearchAndSchemasSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
