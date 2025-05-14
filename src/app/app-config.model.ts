/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FeatureShowMode } from "./interface/feature-flags.interface";
import { MetaMaskInpageProvider } from "@metamask/providers";

export interface AppRuntimeConfig {
    apiServerGqlUrl: string;
    apiServerHttpUrl: string;
    githubClientId?: string;
    loginInstructions?: AppLoginInstructions;
    grafanaLogs?: GrafanaLogsConfiguration;
    features?: FeaturesRuntimeConfig;
}

export interface AppLoginInstructions {
    loginMethod: string;
    loginCredentialsJson: string;
}

export enum LoginMethod {
    PASSWORD = "password",
    GITHUB = "oauth_github",
    WEB3_WALLET = "web3-wallet",
}

export interface GrafanaLogsConfiguration {
    taskDetailsUrl?: string;
    flowHistoryUrl?: string;
}

export interface FeaturesRuntimeConfig {
    showMode: FeatureShowMode;
}

export interface AppUIConfig {
    ingestUploadFileLimitMb: number;
    semanticSearchThresholdScore?: number;
    featureFlags: AppUIConfigFeatureFlags;
}

export interface AppUIConfigFeatureFlags {
    enableLogout: boolean;
    enableScheduling: boolean;
    enableDatasetEnvVarsManagement: boolean;
    enableTermsOfService: boolean;
}

declare global {
    interface Window {
        ethereum?: MetaMaskInpageProvider;
    }
}
