import { ComponentFixture, TestBed } from "@angular/core/testing";
import { SelectDateFormatFieldComponent } from "./select-date-format-field.component";
import { MatIconModule } from "@angular/material/icon";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
} from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import {
    NgbTooltipModule,
    NgbTypeaheadModule,
} from "@ng-bootstrap/ng-bootstrap";
import { RxReactiveFormsModule } from "@rxweb/reactive-form-validators";
import { EventTimeSourceKind } from "../../add-polling-source/add-polling-source-form.types";
import { TooltipsTexts } from "src/app/common/tooltips.text";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/compiler";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";

describe("SelectDateFormatFieldComponent", () => {
    let component: SelectDateFormatFieldComponent;
    let fixture: ComponentFixture<SelectDateFormatFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                SelectDateFormatFieldComponent,
                TooltipIconComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [FormBuilder],
            imports: [
                ReactiveFormsModule,
                MatIconModule,
                MatTableModule,
                NgbTypeaheadModule,
                RxReactiveFormsModule,
                NgbTooltipModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(SelectDateFormatFieldComponent);
        component = fixture.componentInstance;
        component.form = new FormGroup({
            eventTime: new FormGroup({
                kind: new FormControl(EventTimeSourceKind.FROM_METADATA),
            }),
        });
        component.controlName = "eventTime";
        (component.innerTooltips = {
            fromMetadata: TooltipsTexts.EVENT_TIME_FROM_METADATA,
            fromPath: TooltipsTexts.EVENT_TIME_FROM_PATH,
        }),
            (component.currentSource = EventTimeSourceKind.FROM_METADATA);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
