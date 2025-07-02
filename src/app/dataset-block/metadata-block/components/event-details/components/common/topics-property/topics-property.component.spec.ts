/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { TopicsPropertyComponent } from "./topics-property.component";
import { DynamicTableComponent } from "src/app/common/components/dynamic-table/dynamic-table.component";
import { MatTableModule } from "@angular/material/table";
import { SharedTestModule } from "src/app/common/modules/shared-test.module";
import { MqttQos } from "src/app/api/kamu.graphql.interface";

describe("TopicsPropertyComponent", () => {
    let component: TopicsPropertyComponent;
    let fixture: ComponentFixture<TopicsPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MatTableModule, SharedTestModule, TopicsPropertyComponent, DynamicTableComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TopicsPropertyComponent);
        component = fixture.componentInstance;
        component.data = [{ path: "test.com", qos: MqttQos.AtMostOnce }];
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
