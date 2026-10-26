/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideMarkdown } from "ngx-markdown";

import { findElementByDataTestId, setComponentInput } from "@common/helpers/base-test.helpers.spec";
import { metadataBlockSetVocab } from "@common/helpers/data.helpers.spec";
import { SharedTestModule } from "@common/modules/shared-test.module";
import { MarkdownFormatPipe } from "@common/pipes/markdown-format.pipe";

import { YamlViewSectionComponent } from "src/app/dataset-block/metadata-block/components/yaml-view-section/yaml-view-section.component";

describe("YamlViewSectionComponent", () => {
    let component: YamlViewSectionComponent;
    let fixture: ComponentFixture<YamlViewSectionComponent>;
    const mockAddPushSourceYaml =
        "kind: MetadataBlock\nversion: 2\ncontent:\n  systemTime: 2023-12-28T09:41:56.469218218Z\n  prevBlockHash: zW1jaUXuf1HLoKvdQhYNq1e3x6KCFrY7UCqXsgVMfJBJF77\n  sequenceNumber: 1\n  event:\n    kind: addPushSource\n    sourceName: mockSource\n    read:\n      kind: csv\n      schema:\n      - id INT\n      separator: ','\n      encoding: utf8\n      quote: '\"'\n      escape: \\\n      enforceSchema: true\n      nanValue: NaN\n      positiveInf: Inf\n      negativeInf: -Inf\n      dateFormat: rfc3339\n      timestampFormat: rfc3339\n    merge:\n      kind: append\n";

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, YamlViewSectionComponent, MarkdownFormatPipe],
            providers: [provideMarkdown()],
        }).compileComponents();

        fixture = TestBed.createComponent(YamlViewSectionComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should check yaml event viewer  visible ", () => {
        setComponentInput(fixture, "block", metadataBlockSetVocab);
        setComponentInput(fixture, "blockAsYaml", mockAddPushSourceYaml);
        fixture.detectChanges();

        const eventViewer = findElementByDataTestId(fixture, "yaml-event-viewer");
        expect(eventViewer).toBeDefined();
    });
});
