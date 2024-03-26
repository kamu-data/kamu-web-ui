import { Injectable } from "@angular/core";
import { Protocols, ProtocolsApi } from "../api/protocols.api";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ProtocolsService {
    constructor(private protocolsApi: ProtocolsApi) {}

    public getProtocols(): Observable<Protocols[]> {
        return this.protocolsApi.getProtocols();
    }
}
