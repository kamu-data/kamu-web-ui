/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { SharedTestModule } from "@common/modules/shared-test.module";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";

import { FileFromUrlModalComponent } from "./file-from-url-modal.component";

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

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
