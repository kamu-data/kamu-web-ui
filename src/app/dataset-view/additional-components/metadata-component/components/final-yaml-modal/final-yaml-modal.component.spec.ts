import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Apollo } from "apollo-angular";
import { FinalYamlModalComponent } from "./final-yaml-modal.component";

describe("FinalYamlModalComponent", () => {
    let component: FinalYamlModalComponent;
    let fixture: ComponentFixture<FinalYamlModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [FinalYamlModalComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [Apollo, NgbActiveModal],
        }).compileComponents();

        fixture = TestBed.createComponent(FinalYamlModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
