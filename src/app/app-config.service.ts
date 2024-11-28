import { Injectable } from "@angular/core";
import {
    AppRuntimeConfig,
    AppUIConfigFeatureFlags,
    AppLoginInstructions,
    GrafanaLogsConfiguration,
    AppUIConfig,
} from "./app-config.model";
import { environment } from "src/environments/environment";
import { MaybeUndefined } from "./common/app.types";
import AppValues from "./common/app.values";

@Injectable({
    providedIn: "root",
})
export class AppConfigService {
    private appRuntimeConfig?: AppRuntimeConfig;
    private appUiConfig?: AppUIConfig;

    get apiServerUrl(): string {
        if (!this.appRuntimeConfig) {
            this.appRuntimeConfig = AppConfigService.loadAppRuntimeConfig();
        }

        return new URL(this.apiServerGqlUrl).origin;
    }

    get apiServerGqlUrl(): string {
        if (!this.appRuntimeConfig) {
            this.appRuntimeConfig = AppConfigService.loadAppRuntimeConfig();
        }

        return this.appRuntimeConfig.apiServerGqlUrl;
    }

    get apiServerHttpUrl(): string {
        if (!this.appRuntimeConfig) {
            this.appRuntimeConfig = AppConfigService.loadAppRuntimeConfig();
        }

        return this.appRuntimeConfig.apiServerHttpUrl;
    }

    get githubClientId(): MaybeUndefined<string> {
        if (!this.appRuntimeConfig) {
            this.appRuntimeConfig = AppConfigService.loadAppRuntimeConfig();
        }

        return this.appRuntimeConfig.githubClientId;
    }

    get grafanaLogs(): GrafanaLogsConfiguration | null {
        if (!this.appRuntimeConfig) {
            this.appRuntimeConfig = AppConfigService.loadAppRuntimeConfig();
        }

        return this.appRuntimeConfig.grafanaLogs ?? null;
    }

    get loginInstructions(): AppLoginInstructions | null {
        if (!this.appRuntimeConfig) {
            this.appRuntimeConfig = AppConfigService.loadAppRuntimeConfig();
        }

        if (this.appRuntimeConfig.loginInstructions) {
            return this.appRuntimeConfig.loginInstructions;
        } else {
            return null;
        }
    }

    get ingestUploadFileLimitMb(): number {
        if (!this.appRuntimeConfig) {
            this.appRuntimeConfig = AppConfigService.loadAppRuntimeConfig();
        }
        if (!this.appUiConfig) {
            this.appUiConfig = AppConfigService.loadAppUIConfig(this.appRuntimeConfig);
        }

        return this.appUiConfig.ingestUploadFileLimitMb;
    }

    get featureFlags(): AppUIConfigFeatureFlags {
        if (!this.appRuntimeConfig) {
            this.appRuntimeConfig = AppConfigService.loadAppRuntimeConfig();
        }
        if (!this.appUiConfig) {
            this.appUiConfig = AppConfigService.loadAppUIConfig(this.appRuntimeConfig);
        }

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
