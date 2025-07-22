/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable, Injector } from "@angular/core";
import { EthereumGateway } from "./ethereum.gateway";

@Injectable({ providedIn: "root" })
export class EthereumGatewayFactory {
    private injector = inject(Injector);

    public async create(): Promise<EthereumGateway> {
        const { Eip1193EthereumGateway } = await import("./eip1193.ethereum.gateway");
        return new Eip1193EthereumGateway(this.injector);
    }
}
