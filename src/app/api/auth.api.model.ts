/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { AccountFragment } from "./kamu.graphql.interface";

export interface PasswordLoginCredentials {
    login: string;
    password: string;
}

export interface GithubLoginCredentials {
    code: string;
}

export interface Web3WalletOwnershipVerificationRequest {
    message: string;
    signature: string;
}

export interface LoginResponseType {
    accessToken: string;
    account: AccountFragment;
}
