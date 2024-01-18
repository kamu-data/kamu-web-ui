import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HashPropertyComponent } from "./hash-property.component";
import { DisplayHashModule } from "src/app/components/display-hash/display-hash.module";
import { ToastrModule } from "ngx-toastr";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("HashPropertyComponent", () => {
    let component: HashPropertyComponent;
    let fixture: ComponentFixture<HashPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HashPropertyComponent],
            imports: [DisplayHashModule, ToastrModule.forRoot(), SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(HashPropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
