import { ComponentFixture, TestBed } from "@angular/core/testing";
import { PaginationComponent } from "./pagination.component";
import { mockPageBasedInfo } from "src/app/search/mock.data";
import { NgbPaginationModule } from "@ng-bootstrap/ng-bootstrap";

describe("PaginationComponent", () => {
    let component: PaginationComponent;
    let fixture: ComponentFixture<PaginationComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PaginationComponent],
            imports: [NgbPaginationModule],
        }).compileComponents();

        fixture = TestBed.createComponent(PaginationComponent);
        component = fixture.componentInstance;
        component.currentPage = 1;
        component.pageInfo = mockPageBasedInfo;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check emit changed page number", () => {
        const pageNumber = 2;
        const pageChangeEventSpy = spyOn(component.pageChangeEvent, "emit");

        component.onPageChange(2);

        expect(pageChangeEventSpy).toHaveBeenCalledOnceWith(pageNumber);
    });
});
