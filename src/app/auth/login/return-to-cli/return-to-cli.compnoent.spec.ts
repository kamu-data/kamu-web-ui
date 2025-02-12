import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReturnToCliComponent } from "./return-to-cli.component";

describe("ReturnToCliComponent", () => {
    let component: ReturnToCliComponent;
    let fixture: ComponentFixture<ReturnToCliComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ReturnToCliComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ReturnToCliComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
