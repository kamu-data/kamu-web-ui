import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OrderFieldComponent } from "./order-field.component";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";

describe("OrderFieldComponent", () => {
    let component: OrderFieldComponent;
    let fixture: ComponentFixture<OrderFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OrderFieldComponent, TooltipIconComponent],
            imports: [NgbTooltipModule, ReactiveFormsModule, FormsModule],
        }).compileComponents();

        fixture = TestBed.createComponent(OrderFieldComponent);
        component = fixture.componentInstance;
        component.form = new FormGroup({});
        component.controlName = "order";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
