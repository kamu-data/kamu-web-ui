import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CachePropertyComponent } from "./cache-property.component";
import { SharedTestModule } from "src/app/common/shared-test.module";

describe("CachePropertyComponent", () => {
    let component: CachePropertyComponent;
    let fixture: ComponentFixture<CachePropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CachePropertyComponent],
            imports: [SharedTestModule],
        }).compileComponents();

        fixture = TestBed.createComponent(CachePropertyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
