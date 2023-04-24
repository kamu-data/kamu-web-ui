import { ComponentFixture, TestBed } from "@angular/core/testing";

import { OrderFieldComponent } from "./order-field.component";

describe("OrderFieldComponent", () => {
    let component: OrderFieldComponent;
    let fixture: ComponentFixture<OrderFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OrderFieldComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(OrderFieldComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
