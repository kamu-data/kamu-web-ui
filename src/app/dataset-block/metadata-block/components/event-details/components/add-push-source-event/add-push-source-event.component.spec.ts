import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddPushSourceEventComponent } from "./add-push-source-event.component";
import { mockAddPushSource } from "../../mock.events";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { BlockRowDataComponent } from "../../../block-row-data/block-row-data.component";
import { TooltipIconComponent } from "../../../tooltip-icon/tooltip-icon.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

describe("AddPushSourceEventComponent", () => {
    let component: AddPushSourceEventComponent;
    let fixture: ComponentFixture<AddPushSourceEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddPushSourceEventComponent, BlockRowDataComponent, TooltipIconComponent],
            imports: [SharedTestModule, MatIconModule, NgbTooltipModule],
        }).compileComponents();

        fixture = TestBed.createComponent(AddPushSourceEventComponent);
        component = fixture.componentInstance;
        component.event = mockAddPushSource;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
