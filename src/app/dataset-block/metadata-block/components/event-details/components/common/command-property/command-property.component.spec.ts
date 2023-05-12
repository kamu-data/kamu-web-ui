import { ComponentFixture, TestBed } from "@angular/core/testing";

import { CommandPropertyComponent } from "./command-property.component";

describe("CommandPropertyComponent", () => {
    let component: CommandPropertyComponent;
    let fixture: ComponentFixture<CommandPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [CommandPropertyComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(CommandPropertyComponent);
        component = fixture.componentInstance;
        component.data = ["command1", "command2"];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check getter", () => {
        expect(component.commands).toBe("command1 command2");
    });
});
