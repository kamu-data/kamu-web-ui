import { ApolloModule } from "apollo-angular";
import { SizePropertyComponent } from "./../common/size-property/size-property.component";
import { DisplaySizeModule } from "src/app/common/pipes/display-size.module";
import { ChangeDetectionStrategy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { mockAddData } from "../../mock.events";

import { AddDataEventComponent } from "./add-data-event.component";
import { ActivatedRoute } from "@angular/router";
import { OffsetIntervalPropertyComponent } from "../common/offset-interval-property/offset-interval-property.component";

describe("AddDataEventComponent", () => {
    let component: AddDataEventComponent;
    let fixture: ComponentFixture<AddDataEventComponent>;

    const mockSimpleChanges = {
        event: {
            previousValue: undefined,
            currentValue: undefined,
            firstChange: false,
            isFirstChange: () => true,
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [
                AddDataEventComponent,
                SizePropertyComponent,
                OffsetIntervalPropertyComponent,
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
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
            imports: [DisplaySizeModule, ApolloModule],
        })

            .overrideComponent(AddDataEventComponent, {
                set: { changeDetection: ChangeDetectionStrategy.Default },
            })
            .compileComponents();

        fixture = TestBed.createComponent(AddDataEventComponent);
        component = fixture.componentInstance;
        component.event = mockAddData;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check onChanges hook call", () => {
        const spyNgOnChanges = spyOn(
            component,
            "ngOnChanges",
        ).and.callThrough();
        fixture.detectChanges();
        component.ngOnChanges(mockSimpleChanges);
        expect(spyNgOnChanges).toHaveBeenCalledTimes(1);
    });
});
