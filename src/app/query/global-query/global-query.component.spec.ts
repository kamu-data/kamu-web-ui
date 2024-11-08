import { ComponentFixture, TestBed } from "@angular/core/testing";
import { GlobalQueryComponent } from "./global-query.component";

describe("GlobalQueryComponent", () => {
    let component: GlobalQueryComponent;
    let fixture: ComponentFixture<GlobalQueryComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GlobalQueryComponent],
        });
        fixture = TestBed.createComponent(GlobalQueryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
