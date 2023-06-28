import { Injectable } from "@angular/core";
import { EnginesGQL, EnginesQuery } from "./kamu.graphql.interface";
import { ApolloQueryResult } from "@apollo/client";
import { Observable } from "rxjs";
import { first, map } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class EngineApi {
    constructor(private enginesGQL: EnginesGQL) {}

    public getEngines(): Observable<EnginesQuery> {
        return this.enginesGQL.watch().valueChanges.pipe(
            first(),
            map((result: ApolloQueryResult<EnginesQuery>) => {
                return result.data;
            }),
        );
    }
}
