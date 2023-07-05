import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SearchSectionComponent } from "./search-section.component";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { MatTreeModule } from "@angular/material/tree";
import { NgbTypeaheadModule } from "@ng-bootstrap/ng-bootstrap";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";

describe("SearchSectionComponent", () => {
    let component: SearchSectionComponent;
    let fixture: ComponentFixture<SearchSectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SearchSectionComponent],
            providers: [Apollo],
            imports: [
                ApolloModule,
                ApolloTestingModule,
                MatTreeModule,
                NgbTypeaheadModule,
                MatIconModule,
                FormsModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SearchSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
