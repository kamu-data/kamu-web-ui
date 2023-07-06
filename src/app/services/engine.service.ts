import { Injectable } from "@angular/core";
import { EngineApi } from "../api/engine.api";
import { Observable } from "rxjs";
import { EnginesQuery } from "../api/kamu.graphql.interface";

@Injectable({
    providedIn: "root",
})
export class EngineService {
    constructor(private engineApi: EngineApi) {}

    public engines(): Observable<EnginesQuery> {
        return this.engineApi.getEngines();
    }
}
