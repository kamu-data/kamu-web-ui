export interface LoginPageQueryParams {
    callbackUrl?: string;
}

export interface LoginCallbackResponse {
    accessToken: string;
    backendUrl: string;
}
