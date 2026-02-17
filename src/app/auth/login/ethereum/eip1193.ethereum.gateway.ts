/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injector } from "@angular/core";

import { Web3WalletOwnershipVerificationRequest } from "@api/auth.api.model";
import { BrowserProvider, Eip1193Provider } from "ethers";
import { ToastrService } from "ngx-toastr";
import { SiweMessage } from "siwe";
import { MaybeNull } from "src/app/interface/app.types";

import { EthereumGateway } from "./ethereum.gateway";

/* istanbul ignore file */

export class Eip1193EthereumGateway implements EthereumGateway {
    private provider: BrowserProvider;
    private account: string;

    public constructor(private injector: Injector) {}

    private get toastrService(): ToastrService {
        return this.injector.get(ToastrService);
    }

    public get currentWallet(): MaybeNull<string> {
        return this.account;
    }

    public async connectWallet(): Promise<void> {
        if (!this.checkAvailableMetamaskProvider()) {
            return;
        }
        try {
            const accounts = (await this.provider.send("eth_requestAccounts", [])) as string[];
            if (accounts.length > 0) {
                this.account = accounts[0];
            } else {
                this.toastrService.error("No accounts returned.");
            }
        } catch (error) {
            this.toastrService.error("Error connecting wallet: need create a new wallet", "", {
                disableTimeOut: "timeOut",
            });
        }
    }

    private checkAvailableMetamaskProvider(): boolean {
        if (!window.ethereum) {
            this.toastrService.info(
                "To log in, please choose a crypto wallet. For example, please install MetaMask extension.",
                "",
                {
                    timeOut: 5000,
                },
            );
            return false;
        } else {
            this.provider = new BrowserProvider(window.ethereum);
            return true;
        }
    }

    public async createSiweMessage(address: string, statement: string, nonce: string): Promise<string> {
        const chainId = Number((await this.provider.getNetwork()).chainId);
        const now = new Date();
        const minutes_15_in_milliseconds = 15 * 60 * 1000;

        const siweMessage: Partial<SiweMessage> = {
            domain: window.location.host,
            address,
            statement,
            uri: window.location.href,
            version: "1",
            chainId,
            nonce,
            issuedAt: now.toISOString(),
            expirationTime: new Date(now.getTime() + minutes_15_in_milliseconds).toISOString(),
        };
        const message = new SiweMessage(siweMessage);
        return message.prepareMessage();
    }

    public async signInWithEthereum(nonce: string): Promise<MaybeNull<Web3WalletOwnershipVerificationRequest>> {
        try {
            const signer = await this.provider.getSigner();
            const message = await this.createSiweMessage(
                await signer.getAddress(),
                "By signing, you confirm wallet ownership and log in. No transaction or fees are involved.",
                nonce,
            );
            const signature = await signer.signMessage(message);
            return { message, signature };
        } catch (error) {
            return null;
        }
    }
}

declare global {
    interface Window {
        ethereum?: Eip1193Provider;
    }
}
