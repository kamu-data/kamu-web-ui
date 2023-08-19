import { AccountByNameQuery } from "../kamu.graphql.interface";
import { mockAccountDetails } from "./auth.mock";

export const mockAccountByNameResponse: AccountByNameQuery = {
    __typename: "Query",
    accounts: {
        __typename: "Accounts",
        byName: {
            __typename: "Account",
            ...mockAccountDetails,
        },
    },
};

export const mockAccountByNameNotFoundResponse: AccountByNameQuery = {
    __typename: "Query",
    accounts: {
        __typename: "Accounts",
        byName: null,
    },
};
