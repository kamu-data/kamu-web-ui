import { Injectable } from "@angular/core";
import {
    AppRuntimeConfig,
    AppUIConfigFeatureFlags,
    AppLoginInstructions,
    GrafanaLogsConfiguration,
    AppUIConfig,
    FeaturesRuntimeConfig,
} from "./app-config.model";
import { environment } from "src/environments/environment";
import { MaybeUndefined } from "./common/types/app.types";
import AppValues from "./common/values/app.values";

@Injectable({
    providedIn: "root",
})
export class AppConfigService {
    private appRuntimeConfig: AppRuntimeConfig;
    private appUiConfig: AppUIConfig;

    public constructor() {
        this.appRuntimeConfig = AppConfigService.loadAppRuntimeConfig();
        this.appUiConfig = AppConfigService.loadAppUIConfig(this.appRuntimeConfig);
    }

    get apiServerUrl(): string {
        return new URL(this.apiServerGqlUrl).origin;
    }

    get apiServerGqlUrl(): string {
        return this.appRuntimeConfig.apiServerGqlUrl;
    }

    get apiServerHttpUrl(): string {
        return this.appRuntimeConfig.apiServerHttpUrl;
    }

    get githubClientId(): MaybeUndefined<string> {
        return this.appRuntimeConfig.githubClientId;
    }

    get grafanaLogs(): GrafanaLogsConfiguration | null {
        return this.appRuntimeConfig.grafanaLogs ?? null;
    }

    get loginInstructions(): AppLoginInstructions | null {
        if (this.appRuntimeConfig.loginInstructions) {
            return this.appRuntimeConfig.loginInstructions;
        } else {
            return null;
        }
    }

    get featuresRuntimeConfig(): FeaturesRuntimeConfig | null {
        if (this.appRuntimeConfig.features) {
            return this.appRuntimeConfig.features;
        } else {
            return null;
        }
    }

    get ingestUploadFileLimitMb(): number {
        return this.appUiConfig.ingestUploadFileLimitMb;
    }

    get featureFlags(): AppUIConfigFeatureFlags {
        return this.appUiConfig.featureFlags;
    }

    private static loadAppRuntimeConfig(): AppRuntimeConfig {
        const request = new XMLHttpRequest();
        request.open("GET", environment.runtime_config_file, false);
        request.send(null);
        const data: AppRuntimeConfig = JSON.parse(request.responseText) as AppRuntimeConfig;
        return {
            ...data,
            apiServerGqlUrl: AppConfigService.toRemoteURL(data.apiServerGqlUrl),
        };
    }

    private static loadAppUIConfig(app_runtime_config: AppRuntimeConfig): AppUIConfig {
        const request = new XMLHttpRequest();
        request.open("GET", app_runtime_config.apiServerHttpUrl + "/ui-config", false);
        try {
            request.send(null);
            const data: AppUIConfig = JSON.parse(request.responseText) as AppUIConfig;
            return data;
        } catch (error) {
            return AppValues.DEFAULT_UI_CONFIGURATION;
        }
    }

    // If loopback or any address is used - replace hostname with hostname from the browser
    private static toRemoteURL(url: string): string {
        const turl = new URL(url);
        if (["localhost", "127.0.0.1", "0.0.0.0", "[::]"].includes(turl.hostname)) {
            turl.hostname = window.location.hostname;
        }
        return turl.href;
    }
}
