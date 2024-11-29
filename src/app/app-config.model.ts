import { FeatureShowMode } from "./interface/feature-flags.interface";

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
    featureFlags: AppUIConfigFeatureFlags;
}

export interface AppUIConfigFeatureFlags {
    enableLogout: boolean;
    enableScheduling: boolean;
    enableDatasetEnvVarsManagement: boolean;
    enableTermsOfService: boolean;
}
