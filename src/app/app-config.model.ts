/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Eip1193Provider } from "ethers";
import { FeatureShowMode } from "./interface/feature-flags.interface";
import { AccountProvider } from "./api/kamu.graphql.interface";

export interface AppRuntimeConfig {
    apiServerGqlUrl: string;
    apiServerHttpUrl: string;
    githubClientId?: string;
    loginInstructions?: AppLoginInstructions;
    grafanaLogs?: GrafanaLogsConfiguration;
    features?: FeaturesRuntimeConfig;
}

export interface AppLoginInstructions {
    loginMethod: AccountProvider;
    loginCredentialsJson: string;
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
    minNewPasswordLength: number;
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
        ethereum?: Eip1193Provider;
    }
}
