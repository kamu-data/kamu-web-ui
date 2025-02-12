import { MaybeNull } from "../../interface/app.types";
import { FormControl } from "@angular/forms";

export interface LoginPageQueryParams {
    callbackUrl?: string;
}

export interface LoginCallbackResponse {
    accessToken: string;
    backendUrl: string;
}

export interface LoginFormType {
    login: FormControl<MaybeNull<string>>;
    password: FormControl<MaybeNull<string>>;
}
