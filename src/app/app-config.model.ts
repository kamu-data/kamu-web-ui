export interface AppConfig {
    apiServerGqlUrl: string;
    apiServerHttpUrl: string;
    githubClientId?: string;
    ingestUploadFileLimitMb: number;
    featureFlags: AppConfigFeatureFlags;
    loginInstructions?: AppConfigLoginInstructions;
}

export interface AppConfigLoginInstructions {
    loginMethod: string;
    loginCredentialsJson: string;
}

export enum LoginMethod {
    PASSWORD = "password",
    GITHUB = "oauth_github",
}

export interface AppConfigFeatureFlags {
    enableLogout: boolean;
    enableScheduling: boolean;
    enableDatasetEnvVarsManagment: boolean;
}
