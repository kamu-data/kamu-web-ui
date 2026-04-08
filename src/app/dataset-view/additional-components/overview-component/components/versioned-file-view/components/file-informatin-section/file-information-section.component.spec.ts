/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { FileInformationSectionComponent } from "./file-information-section.component";

describe("FileInformationSectionComponent", () => {
    let component: FileInformationSectionComponent;
    let fixture: ComponentFixture<FileInformationSectionComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FileInformationSectionComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(FileInformationSectionComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
