import { mockSetVocab } from "./../../mock.events";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SetVocabEventComponent } from "./set-vocab-event.component";

describe("SetVocabEventComponent", () => {
    let component: SetVocabEventComponent;
    let fixture: ComponentFixture<SetVocabEventComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SetVocabEventComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        fixture = TestBed.createComponent(SetVocabEventComponent);
        component = fixture.componentInstance;
        component.event = mockSetVocab;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
