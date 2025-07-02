/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ModalComponent } from "./modal.component";
import { ModalService } from "./modal.service";
import { of } from "rxjs";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { ModalCommandInterface } from "src/app/interface/modal.interface";
import { Location } from "@angular/common";

describe("ModalComponent", () => {
    let component: ModalComponent;
    let fixture: ComponentFixture<ModalComponent>;
    let modalService: ModalService;
    let location: Location;

    const MOCK_COMMAND_INTERFACE: ModalCommandInterface = {
        type: "dialog",
        context: {
            message: "Mock message",
            type: "dialog",
        },
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [],
            imports: [SharedTestModule, ModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ModalComponent);
        modalService = TestBed.inject(ModalService);
        location = TestBed.inject(Location);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check ngOnit", () => {
        const executeSpy = spyOn(component, "_execute").and.callThrough();
        const getCommandSpy = spyOn(modalService, "getCommand").and.returnValue(of(MOCK_COMMAND_INTERFACE));
        component.ngOnInit();
        expect(executeSpy).toHaveBeenCalledTimes(1);
        expect(getCommandSpy).toHaveBeenCalledTimes(1);
    });

    it("should check _execute method", () => {
        const closeSpy = spyOn(component, "_close").and.callThrough();
        component._execute(MOCK_COMMAND_INTERFACE);
        expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it("should check _close", () => {
        const locationSpy = spyOn(location, "back");
        component._close(true);
        expect(locationSpy).toHaveBeenCalledTimes(1);
    });
});
