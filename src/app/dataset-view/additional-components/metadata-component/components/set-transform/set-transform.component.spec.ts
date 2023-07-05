import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SetTransformComponent } from "./set-transform.component";
import { Apollo, ApolloModule } from "apollo-angular";
import { ActivatedRoute } from "@angular/router";
import { ApolloTestingModule } from "apollo-angular/testing";

describe("SetTransformComponent", () => {
    let component: SetTransformComponent;
    let fixture: ComponentFixture<SetTransformComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SetTransformComponent],
            imports: [ApolloModule, ApolloTestingModule],
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

        fixture = TestBed.createComponent(SetTransformComponent);

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
