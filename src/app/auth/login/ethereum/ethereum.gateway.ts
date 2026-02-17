/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Web3WalletOwnershipVerificationRequest } from "@api/auth.api.model";
import { MaybeNull } from "src/app/interface/app.types";

export interface EthereumGateway {
    currentWallet: MaybeNull<string>;

    connectWallet(): Promise<void>;
    signInWithEthereum(nonce: string): Promise<MaybeNull<Web3WalletOwnershipVerificationRequest>>;
}
