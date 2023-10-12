import { Injectable } from "@angular/core";
import { AppConfig, AppConfigFeatureFlags, AppConfigLoginInstructions } from "./app-config.model";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class AppConfigService {
    private appConfig?: AppConfig;

    get apiServerUrl(): string {
        if (!this.appConfig) {
            this.appConfig = AppConfigService.loadAppConfig();
        }

        return new URL(this.apiServerGqlUrl).origin;
    }

    get apiServerGqlUrl(): string {
        if (!this.appConfig) {
            this.appConfig = AppConfigService.loadAppConfig();
        }

        return this.appConfig.apiServerGqlUrl;
    }

    get featureFlags(): AppConfigFeatureFlags {
        if (!this.appConfig) {
            this.appConfig = AppConfigService.loadAppConfig();
        }

        return this.appConfig.featureFlags;
    }

    get loginInstructions(): AppConfigLoginInstructions | null {
        if (!this.appConfig) {
            this.appConfig = AppConfigService.loadAppConfig();
        }

        if (this.appConfig.loginInstructions) {
            return this.appConfig.loginInstructions;
        } else {
            return null;
        }
    }

    private static loadAppConfig(): AppConfig {
        const request = new XMLHttpRequest();
        request.open("GET", environment.runtime_config_file, false);
        request.send(null);
        const data: AppConfig = JSON.parse(request.responseText) as AppConfig;
        return {
            ...data,
            apiServerGqlUrl: AppConfigService.toRemoteURL(data.apiServerGqlUrl),
        };
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
