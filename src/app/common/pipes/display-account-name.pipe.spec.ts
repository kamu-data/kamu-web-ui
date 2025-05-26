/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import AppValues from "../values/app.values";
import { DisplayAccountNamePipe } from "./display-account-name.pipe";

describe("DisplayAccountNamePipe", () => {
    const pipe = new DisplayAccountNamePipe();

    const MOCK_WEB3_WALLET = "0x00D793c093d5b986bdde8a1D14E7FdBCAb3a6157";

    it("create an instance", () => {
        expect(pipe).toBeTruthy();
    });

    it("should check transform method with web3 provider", () => {
        expect(pipe.transform(MOCK_WEB3_WALLET, AppValues.ACCOUNT_WEB3_WALLET_PROVIDER)).toEqual("0x00D7...6157");
    });

    it("should check transform method if account name isn't web3 wallet", () => {
        expect(pipe.transform(AppValues.DEFAULT_ADMIN_ACCOUNT_NAME, "password")).toEqual(
            AppValues.DEFAULT_ADMIN_ACCOUNT_NAME,
        );
    });
});
