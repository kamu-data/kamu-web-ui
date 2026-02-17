/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideToastr } from "ngx-toastr";
import { TopicsPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/topics-property/topics-property.component";

import { SharedTestModule } from "@common/modules/shared-test.module";
import { MqttQos } from "@api/kamu.graphql.interface";

describe("TopicsPropertyComponent", () => {
    let component: TopicsPropertyComponent;
    let fixture: ComponentFixture<TopicsPropertyComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SharedTestModule, TopicsPropertyComponent],
            providers: [provideToastr()],
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
