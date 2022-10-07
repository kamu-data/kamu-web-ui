import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ModalDialogComponent } from "./modal-dialog.component";

describe("ModalDialogComponent", () => {
    let component: ModalDialogComponent;
    let fixture: ComponentFixture<ModalDialogComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ModalDialogComponent],
            providers: [],
        }).compileComponents();

        fixture = TestBed.createComponent(ModalDialogComponent);
        component = fixture.componentInstance;
        component.context = {};
        fixture.detectChanges();
    });

    it("should create", async () => {
        await expect(component).toBeTruthy();
    });
});
