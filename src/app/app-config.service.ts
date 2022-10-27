import { Injectable } from "@angular/core";

interface AppConfig {
    apiServerGqlUrl: string;
}

@Injectable({
    providedIn: "root",
})
export class AppConfigService {
    private appConfig?: AppConfig;

    get apiServerGqlUrl(): string {
        if (!this.appConfig) {
            this.appConfig = AppConfigService.loadAppConfig();
        }

        return this.appConfig.apiServerGqlUrl;
    }

    private static loadAppConfig(): AppConfig {
        const request = new XMLHttpRequest();
        request.open('GET', "/assets/runtime-config.json", false);  
        request.send(null);
        const data: AppConfig = JSON.parse(request.responseText) as AppConfig;
        return {
            apiServerGqlUrl: AppConfigService.toRemoteURL(data.apiServerGqlUrl)
        };
    }

    // If loopback or any address is used - replace hostname with hostname from the browser
    private static toRemoteURL(url: string): string {
        const turl = new URL(url);
        if (
            ["localhost", "127.0.0.1", "0.0.0.0", "[::]"].includes(
                turl.hostname,
            )
        ) {
            turl.hostname = window.location.hostname;
        }
        return turl.href;
    }
}