export interface AppConfig {
    apiServerGqlUrl: string;
    githubClientId?: string;
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
}
