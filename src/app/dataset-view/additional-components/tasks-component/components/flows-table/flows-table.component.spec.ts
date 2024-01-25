import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowsTableComponent } from "./flows-table.component";

describe("FlowsTableComponent", () => {
    let component: FlowsTableComponent;
    let fixture: ComponentFixture<FlowsTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FlowsTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FlowsTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
