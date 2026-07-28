/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FileInformationModalComponent } from "./file-information-modal.component";

describe("FileInformationModalComponent", () => {
    let component: FileInformationModalComponent;
    let fixture: ComponentFixture<FileInformationModalComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FileInformationModalComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FileInformationModalComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
