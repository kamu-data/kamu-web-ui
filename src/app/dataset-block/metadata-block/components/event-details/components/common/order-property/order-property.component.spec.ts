import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OrderPropertyComponent } from "./order-property.component";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("OrderPropertyComponent", () => {
    let component: OrderPropertyComponent;
    let fixture: ComponentFixture<OrderPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OrderPropertyComponent],
            imports: [SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(OrderPropertyComponent);
        component = fixture.componentInstance;
        component.data = "BY_NAME";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
