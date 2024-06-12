import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FileFromUrlModalComponent } from "./file-from-url-modal.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedTestModule } from "src/app/common/shared-test.module";
import { MatDividerModule } from "@angular/material/divider";

describe("FileFromUrlModalComponent", () => {
    let component: FileFromUrlModalComponent;
    let fixture: ComponentFixture<FileFromUrlModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FileFromUrlModalComponent],
            providers: [NgbActiveModal],
            imports: [ReactiveFormsModule, SharedTestModule, MatDividerModule],
        }).compileComponents();

        fixture = TestBed.createComponent(FileFromUrlModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
