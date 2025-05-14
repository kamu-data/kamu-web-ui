/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { inject, Injectable, Injector } from "@angular/core";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ActionRejectedError, BrowserProvider } from "ethers";
import { firstValueFrom, Observable } from "rxjs";
import { SiweMessage } from "siwe";
import { MaybeNull } from "src/app/interface/app.types";
import { AuthApi } from "src/app/api/auth.api";
import { ToastrService } from "ngx-toastr";
import { Web3WalletCredentials } from "src/app/api/auth.api.model";

@Injectable({
    providedIn: "root",
})
export class MetamaskService {
    private provider = new BrowserProvider(window.ethereum as MetaMaskInpageProvider);
    private account: string;

    private authApi = inject(AuthApi);
    private injector = inject(Injector);

    // Need to get ToastrService from injector rather than constructor injection to avoid cyclic dependency error
    private get toastrService(): ToastrService {
        return this.injector.get(ToastrService);
    }

    public get currentWalet(): MaybeNull<string> {
        return this.account;
    }

    public async connectWallet(): Promise<void> {
        if (!this.provider) {
            this.toastrService.error("No provider found. Please install MetaMask.", "", {
                disableTimeOut: "timeOut",
            });
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

    private getNonceValue(walletAddress: string): Observable<string> {
        return this.authApi.fetchAuthNonceFromWeb3Wallet(walletAddress);
    }

    public async createSiweMessage(address: string, statement: string): Promise<string> {
        const chainId = Number((await this.provider.getNetwork()).chainId);
        const nonce = await firstValueFrom(this.getNonceValue(address));
        const now = new Date();
        const minutes_15_in_seconds = 15 * 60 * 1000;

        const siweMessage: Partial<SiweMessage> = {
            domain: window.location.host,
            address,
            statement,
            uri: window.location.href,
            version: "1",
            chainId,
            nonce,
            issuedAt: now.toISOString(),
            expirationTime: new Date(now.getTime() + minutes_15_in_seconds).toISOString(),
        };
        const message = new SiweMessage(siweMessage);
        return message.prepareMessage();
    }

    public async signInWithEthereum(): Promise<MaybeNull<Web3WalletCredentials>> {
        try {
            const signer = await this.provider.getSigner();
            const message = await this.createSiweMessage(
                await signer.getAddress(),
                "By signing, you confirm wallet ownership and log in. No transaction or fees are involved.",
            );
            const signature = await signer.signMessage(message);
            return { message, signature };
        } catch (error) {
            const err = error as ActionRejectedError;
            if (err.reason === "rejected") {
                this.toastrService.info("User rejected the request");
                return null;
            }
            return null;
        }
    }
}
