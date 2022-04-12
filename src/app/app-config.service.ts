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
            .then((data) => {
                this.appConfig = data as AppConfig;
            });
    }

    get apiServerGqlUrl() {
        if (!this.appConfig) {
            throw Error("Config file not loaded!");
        }

        return this.appConfig.apiServerGqlUrl;
    }
}
