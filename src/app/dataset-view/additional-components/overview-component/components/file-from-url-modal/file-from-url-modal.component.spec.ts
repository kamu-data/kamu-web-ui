/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";

import { FileFromUrlModalComponent } from "src/app/dataset-view/additional-components/overview-component/components/file-from-url-modal/file-from-url-modal.component";
import { FileFromUrlModalHarness } from "src/app/dataset-view/additional-components/overview-component/components/file-from-url-modal/file-from-url-modal.harness";

describe("FileFromUrlModalComponent", () => {
    let component: FileFromUrlModalComponent;
    let fixture: ComponentFixture<FileFromUrlModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            providers: [NgbActiveModal],
            imports: [SharedTestModule, FileFromUrlModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FileFromUrlModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    function fileFromUrlHarness(): Promise<FileFromUrlModalHarness> {
        return TestbedHarnessEnvironment.harnessForFixture(fixture, FileFromUrlModalHarness);
    }

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should keep save disabled until a URL is entered", async () => {
        const modal = await fileFromUrlHarness();

        expect(await modal.getUrlError()).toBeNull();
        expect(await modal.isSaveDisabled()).toBe(true);
    });

    it("should require a source URL", async () => {
        const modal = await fileFromUrlHarness();

        await modal.setUrl("");

        expect(await modal.getUrlError()).toBe("Source URL is required");
        expect(await modal.isSaveDisabled()).toBe(true);
    });

    ["data.csv", "ftp://example.com/data.csv", "https://", "http://exa mple.com/data.csv"].forEach((url) => {
        it(`should reject the source URL "${url}"`, async () => {
            const closeSpy = stubMethod(TestBed.inject(NgbActiveModal), "close");
            const modal = await fileFromUrlHarness();

            await modal.setUrl(url);
            expect(await modal.getUrlError()).toBe("Source URL must be a URL starting with http://, https://");
            expect(await modal.isSaveDisabled()).toBe(true);
            await modal.save();

            expect(closeSpy).not.toHaveBeenCalled();
        });
    });

    ["http://example.com/data.csv", "https://example.com/data.csv"].forEach((url) => {
        it(`should accept the source URL "${url}"`, async () => {
            const closeSpy = stubMethod(TestBed.inject(NgbActiveModal), "close");
            const modal = await fileFromUrlHarness();

            await modal.setUrl(url);
            expect(await modal.getUrlError()).toBeNull();
            expect(await modal.isSaveDisabled()).toBe(false);
            await modal.save();

            expect(closeSpy).toHaveBeenCalledTimes(1);
        });
    });
});
