import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CacheFieldComponent } from "./cache-field.component";
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";

describe("CacheFieldComponent", () => {
    let component: CacheFieldComponent;
    let fixture: ComponentFixture<CacheFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CacheFieldComponent, TooltipIconComponent],
            providers: [FormBuilder],
            imports: [ReactiveFormsModule, FormsModule, NgbTooltipModule],
        }).compileComponents();

        fixture = TestBed.createComponent(CacheFieldComponent);
        component = fixture.componentInstance;
        component.form = new FormGroup({});
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
