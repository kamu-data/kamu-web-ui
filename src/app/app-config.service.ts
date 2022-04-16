import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

interface AppConfig {
    apiServerGqlUrl: string;
}

@Injectable({
    providedIn: "root",
})
export class AppConfigService {
    private appConfig: AppConfig;

    constructor(private http: HttpClient) {}

    loadAppConfig() {
        return this.http
            .get("/assets/runtime-config.json")
            .toPromise()
            .then((data: any) => {
                data.apiServerGqlUrl = this.toRemoteURL(data.apiServerGqlUrl);
                this.appConfig = data as AppConfig;
            });
    }

    get apiServerGqlUrl() {
        if (!this.appConfig) {
            throw Error("Config is not loaded!");
        }

        return this.appConfig.apiServerGqlUrl;
    }

    // If loopback or any address is used - replace hostname with hostname from the browser
    private toRemoteURL(url: string): string {
        let turl = new URL(url);
        if (
            ["localhost", "127.0.0.1", "0.0.0.0", "[::]"].includes(
                turl.hostname,
            )
        ) {
            turl.hostname = window.location.hostname;
        }
        return turl.toString();
    }
}
