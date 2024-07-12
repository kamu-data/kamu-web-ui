import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { EditKeyValueModalComponent } from "./edit-key-value-modal.component";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Apollo } from "apollo-angular";
import { ToastrModule } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";

describe("EditKeyValueModalComponent", () => {
    let component: EditKeyValueModalComponent;
    let fixture: ComponentFixture<EditKeyValueModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [EditKeyValueModalComponent],
            providers: [
                NgbActiveModal,
                FormBuilder,
                Apollo,
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            queryParamMap: {
                                get: (key: string) => {
                                    switch (key) {
                                        case "page":
                                            return 2;
                                    }
                                },
                            },
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
            imports: [ToastrModule.forRoot(), MatCheckboxModule, FormsModule, ReactiveFormsModule, MatDividerModule],
        }).compileComponents();

        fixture = TestBed.createComponent(EditKeyValueModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
