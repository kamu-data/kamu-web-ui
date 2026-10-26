/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Location } from "@angular/common";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { of } from "rxjs";

import { ModalDialogComponent } from "@common/components/modal/modal-dialog.component";
import { ModalComponent } from "@common/components/modal/modal.component";
import { ModalService } from "@common/components/modal/modal.service";
import { findComponentInstance, findComponentInstances } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { ModalCommandInterface } from "@interface/modal.interface";

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

    it("should execute the command it receives on init", () => {
        const getCommandSpy = vi.spyOn(modalService, "getCommand").mockReturnValue(of(MOCK_COMMAND_INTERFACE));
        fixture = TestBed.createComponent(ModalComponent);
        component = fixture.componentInstance;
        const executeSpy = vi.spyOn(component, "_execute");
        fixture.detectChanges();
        expect(executeSpy).toHaveBeenCalledTimes(1);
        expect(getCommandSpy).toHaveBeenCalledTimes(1);
    });

    it("should check _execute method", () => {
        const closeSpy = vi.spyOn(component, "_close");
        component._execute(MOCK_COMMAND_INTERFACE);
        expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it("should render the component for the command type with its context", () => {
        component._execute(MOCK_COMMAND_INTERFACE);

        const dialog = findComponentInstance(fixture, ModalDialogComponent);
        expect(dialog.context.message).toEqual("Mock message");
    });

    it("should replace the open modal with the next one and remove it on close", () => {
        component._execute(MOCK_COMMAND_INTERFACE);
        component._execute(MOCK_COMMAND_INTERFACE);
        expect(findComponentInstances(fixture, ModalDialogComponent).length).toEqual(1);

        component._close();
        expect(findComponentInstances(fixture, ModalDialogComponent)).toEqual([]);
    });

    it("should check _close", () => {
        const locationSpy = vi.spyOn(location, "back").mockImplementation(() => {});
        component._close(true);
        expect(locationSpy).toHaveBeenCalledTimes(1);
    });

    it("should keep a single keydown listener across opened modals", () => {
        const processSpy = vi.spyOn(component, "_processKDB").mockImplementation(() => {});
        component._execute(MOCK_COMMAND_INTERFACE);
        component._execute(MOCK_COMMAND_INTERFACE);

        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        expect(processSpy).toHaveBeenCalledTimes(1);

        component._close();
        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        expect(processSpy).toHaveBeenCalledTimes(1);
    });

    it("should remove the keydown listener on destroy", () => {
        const processSpy = vi.spyOn(component, "_processKDB").mockImplementation(() => {});
        component._execute(MOCK_COMMAND_INTERFACE);
        fixture.destroy();

        document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
        expect(processSpy).not.toHaveBeenCalled();
    });
});
