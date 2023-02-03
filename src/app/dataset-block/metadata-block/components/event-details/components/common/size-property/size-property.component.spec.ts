import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SizePropertyComponent } from "./size-property.component";

describe("SizePropertyComponent", () => {
    let component: SizePropertyComponent;
    let fixture: ComponentFixture<SizePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SizePropertyComponent],
            imports: [DisplaySizeModule],
        }).compileComponents();

        fixture = TestBed.createComponent(SizePropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
