import { Injectable } from "@angular/core";
import AppValues from "../common/app.values";

@Injectable({ providedIn: "root" })
export class LocalStorageService {
    public get accessToken(): string | null {
        return localStorage.getItem(AppValues.LOCAL_STORAGE_ACCESS_TOKEN);
    }

    public get loginCallbackUrl(): string | null {
        return localStorage.getItem(AppValues.LOCAL_STORAGE_LOGIN_CALLBACK_URL);
    }

    public get redirectAfterLoginUrl(): string | null {
        return localStorage.getItem(AppValues.LOCAL_STORAGE_LOGIN_REDIRECT_URL);
    }

    public setRedirectAfterLoginUrl(url: string | null) {
        if (url) {
            localStorage.setItem(AppValues.LOCAL_STORAGE_LOGIN_REDIRECT_URL, url);
        } else {
            localStorage.removeItem(AppValues.LOCAL_STORAGE_LOGIN_REDIRECT_URL);
        }
    }

    public setAccessToken(token: string | null) {
        if (token) {
            localStorage.setItem(AppValues.LOCAL_STORAGE_ACCESS_TOKEN, token);
        } else {
            localStorage.removeItem(AppValues.LOCAL_STORAGE_ACCESS_TOKEN);
        }
    }

    public setLoginCallbackUrl(loginCallbackUrl: string | null) {
        if (loginCallbackUrl) {
            localStorage.setItem(AppValues.LOCAL_STORAGE_LOGIN_CALLBACK_URL, loginCallbackUrl);
        } else {
            localStorage.removeItem(AppValues.LOCAL_STORAGE_LOGIN_CALLBACK_URL);
        }
    }

    public reset() {
        localStorage.clear();
    }
}
