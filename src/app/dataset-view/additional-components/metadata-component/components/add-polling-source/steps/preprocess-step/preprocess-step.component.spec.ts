import { ComponentFixture, TestBed } from "@angular/core/testing";

import { PreprocessStepComponent } from "./preprocess-step.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Apollo, ApolloModule } from "apollo-angular";
import { ApolloTestingModule } from "apollo-angular/testing";
import { ActivatedRoute } from "@angular/router";

describe("PreprocessStepComponent", () => {
    let component: PreprocessStepComponent;
    let fixture: ComponentFixture<PreprocessStepComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PreprocessStepComponent],
            imports: [
                ReactiveFormsModule,
                ApolloModule,
                ApolloTestingModule,
                FormsModule,
            ],
            providers: [
                Apollo,
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
        }).compileComponents();

        fixture = TestBed.createComponent(PreprocessStepComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
