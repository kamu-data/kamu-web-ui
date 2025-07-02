/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { CommandPropertyComponent } from "./command-property.component";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";

describe("CommandPropertyComponent", () => {
    let component: CommandPropertyComponent;
    let fixture: ComponentFixture<CommandPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, CommandPropertyComponent],
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
