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
import { SetPollingSourceToolipsTexts } from "src/app/common/tooltips/tooltips.text";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { ActivatedRoute } from "@angular/router";

describe("SelectDateFormatFieldComponent", () => {
    let component: SelectDateFormatFieldComponent;
    let fixture: ComponentFixture<SelectDateFormatFieldComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                SelectDateFormatFieldComponent,
                TooltipIconComponent,
            ],
            providers: [
                FormBuilder,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            paramMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "accountName":
                                            return "accountName";
                                        case "datasetName":
                                            return "datasetName";
                                    }
                                },
                            },
                        },
                    },
                },
            ],
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
            fromMetadata: SetPollingSourceToolipsTexts.EVENT_TIME_FROM_METADATA,
            fromPath: SetPollingSourceToolipsTexts.EVENT_TIME_FROM_PATH,
        }),
            (component.currentSource = EventTimeSourceKind.FROM_METADATA);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should change type to fromPath", () => {
        component.eventTimeGroup.patchValue({
            kind: EventTimeSourceKind.FROM_PATH,
        });
        fixture.detectChanges();
        expect(component.currentSource).toBe(EventTimeSourceKind.FROM_PATH);
    });

    it("should change type to fromMetadata", () => {
        component.eventTimeGroup.patchValue({
            kind: EventTimeSourceKind.FROM_METADATA,
        });
        fixture.detectChanges();
        expect(component.currentSource).toBe(EventTimeSourceKind.FROM_METADATA);
    });
});
