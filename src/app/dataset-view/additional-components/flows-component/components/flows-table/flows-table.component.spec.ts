import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowsTableComponent } from "./flows-table.component";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";

describe("FlowsTableComponent", () => {
    let component: FlowsTableComponent;
    let fixture: ComponentFixture<FlowsTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FlowsTableComponent],
            imports: [MatTableModule, MatMenuModule, MatDividerModule],
        }).compileComponents();

        fixture = TestBed.createComponent(FlowsTableComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});