import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SqlEditorComponent } from "./sql-editor.component";
import { MonacoService } from "../../services/monaco.service";
import { EditorModule } from "../../editor.module";
import { editorMock } from "../../mock/editor.mock";

describe("SqlEditorComponent", () => {
    let component: SqlEditorComponent;
    let monacoService: MonacoService;
    let fixture: ComponentFixture<SqlEditorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [EditorModule],
            declarations: [SqlEditorComponent],
            providers: [MonacoService],
        }).compileComponents();

        fixture = TestBed.createComponent(SqlEditorComponent);
        monacoService = TestBed.inject(MonacoService);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("on error should call setErrorMarker", () => {
        const errorTest = "error text";
        const simpleChanges = {
            error: {
                previousValue: undefined,
                currentValue: errorTest,
                firstChange: true,
                isFirstChange: () => true,
            },
        };
        const spyNgOnChanges = spyOn(monacoService, "setErrorMarker");
        component.error = errorTest;
        component.ngOnChanges(simpleChanges);
        expect(spyNgOnChanges).toHaveBeenCalledTimes(1);
    });

    it("on empty error should call clearErrorMarker", () => {
        const simpleChanges = {
            error: {
                previousValue: undefined,
                currentValue: undefined,
                firstChange: true,
                isFirstChange: () => true,
            },
        };
        const spyNgOnChanges = spyOn(monacoService, "clearErrorMarker");
        component.ngOnChanges(simpleChanges);
        expect(spyNgOnChanges).toHaveBeenCalledTimes(1);
    });

    it("should emit templateChange on modelChange", () => {
        const templateChangeSpy = spyOn(component.templateChange, "emit");

        component.modelChange();

        expect(templateChangeSpy).toHaveBeenCalledWith(component.template);
    });

    it("should emit onEditorLoaded on onInitEditor", () => {
        const onEditorLoadedSpy = spyOn(component.onEditorLoaded, "emit");

        component.onInitEditor(editorMock);

        expect(onEditorLoadedSpy).toHaveBeenCalledWith();
    });
});
