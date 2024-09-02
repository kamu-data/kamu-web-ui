import { ComponentFixture, TestBed } from "@angular/core/testing";
import { OwnerPropertyComponent } from "./owner-property.component";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { AccountBasicsFragment } from "src/app/api/kamu.graphql.interface";
import { RouterModule } from "@angular/router";

describe("OwnerPropertyComponent", () => {
    let component: OwnerPropertyComponent;
    let fixture: ComponentFixture<OwnerPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [OwnerPropertyComponent],
            imports: [SharedTestModule, RouterModule],
        }).compileComponents();

        fixture = TestBed.createComponent(OwnerPropertyComponent);
        component = fixture.componentInstance;
        component.data = { id: "1", accountName: "kamu" } as AccountBasicsFragment;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
