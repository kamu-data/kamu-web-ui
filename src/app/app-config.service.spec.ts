/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { TestBed } from "@angular/core/testing";

import { stubMethod } from "@common/helpers/base-test.helpers.spec";
import AppValues from "@common/values/app.values";

import { AppRuntimeConfig, AppUIConfig } from "src/app/app-config.model";
import { AppConfigService } from "src/app/app-config.service";

describe("AppConfigService", () => {
    const RUNTIME_CONFIG: AppRuntimeConfig = {
        apiServerGqlUrl: "http://localhost:8080/graphql",
        apiServerHttpUrl: "http://localhost:8080",
    };

    /** Answers the service's synchronous config requests: the runtime config, then the backend's `/ui-config`. */
    function serveConfig(uiConfig: AppUIConfig): AppConfigService {
        let requestedUrl = "";
        vi.spyOn(XMLHttpRequest.prototype, "open").mockImplementation((_method: string, url: string | URL) => {
            requestedUrl = url.toString();
        });
        stubMethod(XMLHttpRequest.prototype, "send");
        vi.spyOn(XMLHttpRequest.prototype, "responseText", "get").mockImplementation(() =>
            JSON.stringify(requestedUrl.endsWith("/ui-config") ? uiConfig : RUNTIME_CONFIG),
        );
        return TestBed.inject(AppConfigService);
    }

    [true, false].forEach((loopbackTargetsOnly) => {
        it(`should report loopbackTargetsOnly=${loopbackTargetsOnly} as the backend sends it`, () => {
            const service = serveConfig({
                ...AppValues.DEFAULT_UI_CONFIGURATION,
                webhooks: { loopbackTargetsOnly },
            });

            expect(service.webhookLoopbackTargetsOnly).toBe(loopbackTargetsOnly);
        });
    });

    it("should report loopbackTargetsOnly=false when the backend does not send the webhooks mode", () => {
        const service = serveConfig(AppValues.DEFAULT_UI_CONFIGURATION);

        expect(service.webhookLoopbackTargetsOnly).toBe(false);
    });
});
