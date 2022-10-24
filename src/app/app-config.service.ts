import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: "root",
})
export class AppConfigService {

    private readonly _apiServerGqlUrl: string;

    constructor() {
        this._apiServerGqlUrl = this.toRemoteURL(environment.api_server_gql_url);
    }

    get apiServerGqlUrl() {
        return this._apiServerGqlUrl;
    }

    // If loopback or any address is used - replace hostname with hostname from the browser
    private toRemoteURL(url: string): string {
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
