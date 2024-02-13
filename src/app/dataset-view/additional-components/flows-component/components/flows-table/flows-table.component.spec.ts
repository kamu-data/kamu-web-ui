import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FlowsTableComponent } from "./flows-table.component";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatDividerModule } from "@angular/material/divider";
import { MatRadioChange, MatRadioModule } from "@angular/material/radio";
import { MatIconModule } from "@angular/material/icon";
import { FormsModule } from "@angular/forms";
import { mockFlowSummaryDataFragments } from "src/app/api/mock/dataset-flow.mock";
import { FilterByInitiatorEnum } from "./flows-table.types";
import { DisplayTimeModule } from "src/app/components/display-time/display-time.module";
import { FlowStatus } from "src/app/api/kamu.graphql.interface";

describe("FlowsTableComponent", () => {
    let component: FlowsTableComponent;
    let fixture: ComponentFixture<FlowsTableComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FlowsTableComponent],
            imports: [
                MatTableModule,
                MatMenuModule,
                MatDividerModule,
                MatRadioModule,
                MatIconModule,
                FormsModule,
                DisplayTimeModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(FlowsTableComponent);
        component = fixture.componentInstance;
        component.nodes = mockFlowSummaryDataFragments;
        component.filterByStatus = null;
        component.filterByInitiator = FilterByInitiatorEnum.All;
        component.searchByAccountName = "";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check change filter by status", () => {
        const filterByStatusChangeSpy = spyOn(component.filterByStatusChange, "emit");
        component.changeFilterByStatus(FlowStatus.Finished);
        expect(filterByStatusChangeSpy).toHaveBeenCalledWith(FlowStatus.Finished);
    });

    it("should check change filter by initiator", () => {
        const filterByInitiatorChangeSpy = spyOn(component.filterByInitiatorChange, "emit");
        component.changeFilterByInitiator({ value: FilterByInitiatorEnum.System } as MatRadioChange);
        expect(filterByInitiatorChangeSpy).toHaveBeenCalledWith(FilterByInitiatorEnum.System);
    });

    it("should check search by accountName emits value ", () => {
        const searchByAccountNameChangeSpy = spyOn(component.searchByAccountNameChange, "emit");
        component.onSearchByAccountName();
        expect(searchByAccountNameChangeSpy).toHaveBeenCalledWith("");
    });
});
