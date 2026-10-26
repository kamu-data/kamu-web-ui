/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ComponentFixture, TestBed } from "@angular/core/testing";

import { provideToastr } from "ngx-toastr";

import { SharedTestModule } from "@common/modules/shared-test.module";
import { MqttQos, MqttTopicSubscription } from "@api/kamu.graphql.interface";

import { TopicsPropertyComponent } from "src/app/dataset-block/metadata-block/components/event-details/components/common/topics-property/topics-property.component";

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
        fixture.componentRef.setInput("data", [
            { path: "test.com", qos: MqttQos.AtMostOnce },
        ] satisfies MqttTopicSubscription[]);
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
