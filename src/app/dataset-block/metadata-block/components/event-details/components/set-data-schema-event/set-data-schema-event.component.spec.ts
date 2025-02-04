import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SetDataSchemaEventComponent } from "./set-data-schema-event.component";
import { BlockRowDataComponent } from "../../../../../../common/components/block-row-data/block-row-data.component";
import { TooltipIconComponent } from "../../../../../../common/components/tooltip-icon/tooltip-icon.component";
import { mockSetDataSchema } from "../../mock.events";
import { MatIconModule } from "@angular/material/icon";
import { DynamicTableComponent } from "src/app/common/components/dynamic-table/dynamic-table.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { MatTableModule } from "@angular/material/table";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("SetDataSchemaEventComponent", () => {
    let component: SetDataSchemaEventComponent;
    let fixture: ComponentFixture<SetDataSchemaEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                SetDataSchemaEventComponent,
                DynamicTableComponent,
                BlockRowDataComponent,
                TooltipIconComponent,
            ],
            imports: [MatIconModule, NgbTooltipModule, MatTableModule, SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(SetDataSchemaEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetDataSchema;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
