import { SharedTestModule } from "src/app/common/shared-test.module";
import { Apollo } from "apollo-angular";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddDataModalComponent } from "./add-data-modal.component";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { HttpClientModule } from "@angular/common/http";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";

describe("AddDataModalComponent", () => {
    let component: AddDataModalComponent;
    let fixture: ComponentFixture<AddDataModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AddDataModalComponent],
            providers: [Apollo, NgbActiveModal],
            imports: [HttpClientModule, SharedTestModule, MatIconModule, MatDividerModule],
        }).compileComponents();

        fixture = TestBed.createComponent(AddDataModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
