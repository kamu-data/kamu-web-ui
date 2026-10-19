/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Network } from "ethers";

export function chainNameFromId(chainId: number): string {
    try {
        // Returns an ethers Network object for known chains
        const net = Network.from(chainId);
        return net.name; // e.g. "mainnet", "sepolia"
    } catch {
        return "unknown";
    }
}
