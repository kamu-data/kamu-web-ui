import {
    ComponentFixture,
    TestBed,
    fakeAsync,
    flush,
    tick,
} from "@angular/core/testing";

import { CacheFieldComponent } from "./cache-field.component";
import {
    FormBuilder,
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
} from "@angular/forms";
import { TooltipIconComponent } from "src/app/dataset-block/metadata-block/components/tooltip-icon/tooltip-icon.component";
import { NgbTooltipModule } from "@ng-bootstrap/ng-bootstrap";
import {
    findElement,
    findElementByDataTestId,
} from "src/app/common/base-test.helpers.spec";

describe("CacheFieldComponent", () => {
    let component: CacheFieldComponent;
    let fixture: ComponentFixture<CacheFieldComponent>;
    const dataTestId = "cache-control";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CacheFieldComponent, TooltipIconComponent],
            providers: [FormBuilder],
            imports: [ReactiveFormsModule, FormsModule, NgbTooltipModule],
        }).compileComponents();

        fixture = TestBed.createComponent(CacheFieldComponent);
        component = fixture.componentInstance;
        component.controlName = "cache";
        component.form = new FormGroup({});
        component.dataTestId = dataTestId;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check change state checkbox", () => {
        const cacheCheckbox = findElementByDataTestId(
            fixture,
            dataTestId,
        ) as HTMLInputElement;
        expect(cacheCheckbox.checked).toBeFalse();
        expect(component.isCache).toBeFalse();
    });

    it("should check initial state", () => {
        component.form = new FormGroup({
            cache: new FormGroup({
                kind: new FormControl("forever"),
            }),
        });
        fixture.detectChanges();
        component.ngOnInit();
        expect(component.isCache).toBeTrue();
    });

    it("should check checked and unchecked value", fakeAsync(() => {
        const cacheCheckbox = findElement(
            fixture,
            '[data-test-id="cache-control"]',
        );
        const onCheckedCacheSpy = spyOn(
            component,
            "onCheckedCache",
        ).and.callThrough();

        cacheCheckbox.triggerEventHandler("change", {
            target: { checked: true },
        });
        tick();
        fixture.detectChanges();
        expect(onCheckedCacheSpy).toHaveBeenCalledTimes(1);
        expect(component.form.controls.cache).toBeDefined();

        cacheCheckbox.triggerEventHandler("change", {
            target: { checked: false },
        });
        tick();
        fixture.detectChanges();
        expect(onCheckedCacheSpy).toHaveBeenCalledTimes(2);
        expect(component.form.controls.cache).toBeUndefined();
        flush();
    }));
});
