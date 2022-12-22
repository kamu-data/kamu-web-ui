import { TooltipIconComponent } from "./../tooltip-icon/tooltip-icon.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { BlockRowDataComponent } from "./block-row-data.component";
import { MatIconModule } from "@angular/material/icon";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

describe("BlockRowDataComponent", () => {
    let component: BlockRowDataComponent;
    let fixture: ComponentFixture<BlockRowDataComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BlockRowDataComponent, TooltipIconComponent],
            imports: [MatIconModule, NgbTooltipModule],
        }).compileComponents();

        fixture = TestBed.createComponent(BlockRowDataComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
