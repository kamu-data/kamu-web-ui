/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ValueNotFoundComponent } from "@common/components/value-not-found/value-not-found.component";
import { ValueNotFoundHarness } from "@common/components/value-not-found/value-not-found.harness";
import { setComponentInput } from "@common/helpers/base-test.helpers.spec";

describe("ValueNotFoundComponent", () => {
    let fixture: ComponentFixture<ValueNotFoundComponent>;
    let harness: ValueNotFoundHarness;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ValueNotFoundComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ValueNotFoundComponent);
        setComponentInput(fixture, "message", "There is no version 9 of this file.");
        setComponentInput(fixture, "actionLabel", "Go to the latest version");
        fixture.detectChanges();
        harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, ValueNotFoundHarness);
    });

    it("should show the message and the action", async () => {
        expect(await harness.getMessage()).toBe("There is no version 9 of this file.");
        expect(await harness.getActionLabel()).toBe("Go to the latest version");
    });

    it("should emit the action when it is clicked", async () => {
        const actionSpy = vi.fn();
        fixture.componentInstance.actionEvent.subscribe(actionSpy);

        await harness.runAction();

        expect(actionSpy).toHaveBeenCalledTimes(1);
    });
});
