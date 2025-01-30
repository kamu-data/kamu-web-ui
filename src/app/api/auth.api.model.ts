import { AccountFragment } from "./kamu.graphql.interface";

export interface PasswordLoginCredentials {
    login: string;
    password: string;
}

export interface GithubLoginCredentials {
    code: string;
}

export interface LoginResponseType {
    accessToken: string;
    account: AccountFragment;
}
