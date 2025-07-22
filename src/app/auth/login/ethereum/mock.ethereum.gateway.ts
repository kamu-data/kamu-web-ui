/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { EthereumGateway } from "./ethereum.gateway";
import { Web3WalletOwnershipVerificationRequest } from "src/app/api/auth.api.model";
import { MaybeNull } from "src/app/interface/app.types";

export class MockEthereumGateway implements EthereumGateway {
    public static readonly WALLET_ADDRESS = "0xMockWalletAddress";
    public static readonly MESSAGE = "MockMessage";
    public static readonly SIGNATURE_PREFIX = "MockSignatureForNonce:";

    public walletToConnectTo: MaybeNull<string> = MockEthereumGateway.WALLET_ADDRESS;
    public currentWallet: MaybeNull<string> = null;

    public connectWallet(): Promise<void> {
        this.currentWallet = this.walletToConnectTo;
        return Promise.resolve();
    }

    public signInWithEthereum(nonce: string): Promise<MaybeNull<Web3WalletOwnershipVerificationRequest>> {
        if (!this.currentWallet) {
            return Promise.resolve(null);
        }

        return Promise.resolve({
            walletAddress: this.currentWallet,
            signature: `${MockEthereumGateway.SIGNATURE_PREFIX}${nonce}`,
            message: MockEthereumGateway.MESSAGE,
        } as Web3WalletOwnershipVerificationRequest);
    }
}

export class MockEthereumGatewayFactory {
    public create(): Promise<EthereumGateway> {
        return Promise.resolve(new MockEthereumGateway());
    }
}
