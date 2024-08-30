import { inject, Injectable } from "@angular/core";
import { EngineApi } from "../api/engine.api";
import { Observable } from "rxjs";
import { EnginesQuery } from "../api/kamu.graphql.interface";

@Injectable({
    providedIn: "root",
})
export class EngineService {
    private engineApi = inject(EngineApi);

    public engines(): Observable<EnginesQuery> {
        return this.engineApi.getEngines();
    }
}
