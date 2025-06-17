/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Observable, catchError, first, map } from "rxjs";
import { inject, Injectable } from "@angular/core";
import {
    AccountByNameGQL,
    AccountByNameQuery,
    AccountChangeEmailGQL,
    AccountChangeEmailMutation,
    AccountDatasetFlowsPausedGQL,
    AccountDatasetFlowsPausedQuery,
    AccountFlowFilters,
    AccountFragment,
    AccountListDatasetsWithFlowsGQL,
    AccountListDatasetsWithFlowsQuery,
    AccountListFlowsGQL,
    AccountListFlowsQuery,
    AccountPauseFlowsGQL,
    AccountPauseFlowsMutation,
    AccountResumeFlowsGQL,
    AccountResumeFlowsMutation,
    AccountWithEmailGQL,
    AccountWithEmailQuery,
    ChangeAccountUsernameGQL,
    ChangeAccountUsernameMutation,
    DeleteAccountByNameGQL,
    DeleteAccountByNameMutation,
    ChangeUserPasswordGQL,
    ChangeAdminPasswordGQL,
    ChangeUserPasswordMutation,
    ChangeAdminPasswordMutation,
} from "./kamu.graphql.interface";
import { MaybeNull } from "../interface/app.types";
import { ApolloError, ApolloQueryResult } from "@apollo/client";
import { MutationResult } from "apollo-angular";
import { noCacheFetchPolicy } from "../common/helpers/data.helpers";
import { DatasetOperationError } from "../common/values/errors";

@Injectable({ providedIn: "root" })
export class AccountApi {
    private accountByNameGql = inject(AccountByNameGQL);
    private accountListFlowsGql = inject(AccountListFlowsGQL);
    private accountListDatasetsWithFlowsGql = inject(AccountListDatasetsWithFlowsGQL);
    private accountDatasetFlowsPausedGql = inject(AccountDatasetFlowsPausedGQL);
    private accountPauseFlowsGql = inject(AccountPauseFlowsGQL);
    private accountResumeFlowsGql = inject(AccountResumeFlowsGQL);
    private accountWithEmailGql = inject(AccountWithEmailGQL);
    private accountChangeEmailGQL = inject(AccountChangeEmailGQL);
    private deleteAccountByNameGQL = inject(DeleteAccountByNameGQL);
    private changeAccountUsernameGQL = inject(ChangeAccountUsernameGQL);
    private changeAdminPasswordGQL = inject(ChangeAdminPasswordGQL);
    private changeUserPasswordGQL = inject(ChangeUserPasswordGQL);

    public changeAccountUsername(params: {
        accountName: string;
        newName: string;
    }): Observable<ChangeAccountUsernameMutation> {
        return this.changeAccountUsernameGQL.mutate({ accountName: params.accountName, newName: params.newName }).pipe(
            first(),
            map((result: MutationResult<ChangeAccountUsernameMutation>) => {
                /* istanbul ignore else */
                if (result.data) {
                    return result.data;
                } else {
                    throw new DatasetOperationError(result.errors ?? []);
                }
            }),
        );
    }

    public changeAccountEmail(params: {
        accountName: string;
        newEmail: string;
    }): Observable<AccountChangeEmailMutation> {
        return this.accountChangeEmailGQL.mutate(params).pipe(
            first(),
            map((result: MutationResult<AccountChangeEmailMutation>) => {
                /* istanbul ignore else */
                if (result.data) {
                    return result.data;
                } else {
                    throw new DatasetOperationError(result.errors ?? []);
                }
            }),
        );
    }

    public changeAdminPassword(params: {
        accountName: string;
        password: string;
    }): Observable<ChangeAdminPasswordMutation> {
        return this.changeAdminPasswordGQL.mutate(params).pipe(
            first(),
            map((result: MutationResult<ChangeAdminPasswordMutation>) => {
                /* istanbul ignore else */
                if (result.data) {
                    return result.data;
                } else {
                    throw new DatasetOperationError(result.errors ?? []);
                }
            }),
        );
    }

    public changeUserPassword(params: {
        accountName: string;
        oldPassword: string;
        newPassword: string;
    }): Observable<ChangeUserPasswordMutation> {
        return this.changeUserPasswordGQL.mutate(params).pipe(
            first(),
            map((result: MutationResult<ChangeUserPasswordMutation>) => {
                console.log("data", result);
                /* istanbul ignore else */
                if (result.data) {
                    return result.data;
                } else {
                    throw new DatasetOperationError(result.errors ?? []);
                }
            }),
            catchError((e: ApolloError) => {
                throw new DatasetOperationError(e.graphQLErrors);
            }),
        );
    }

    public fetchAccountWithEmail(accountName: string): Observable<AccountWithEmailQuery> {
        return this.accountWithEmailGql
            .watch(
                {
                    accountName,
                },
                noCacheFetchPolicy,
            )
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<AccountWithEmailQuery>) => {
                    return result.data;
                }),
            );
    }

    public fetchAccountByName(accountName: string): Observable<MaybeNull<AccountFragment>> {
        return this.accountByNameGql
            .watch({
                accountName,
            })
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<AccountByNameQuery>) => {
                    return result.data.accounts.byName ?? null;
                }),
            );
    }

    public fetchAccountListFlows(params: {
        accountName: string;
        page: number;
        perPageTable: number;
        perPageTiles: number;
        filters: AccountFlowFilters;
    }): Observable<AccountListFlowsQuery> {
        return this.accountListFlowsGql
            .watch(
                {
                    name: params.accountName,
                    page: params.page,
                    perPageTable: params.perPageTable,
                    perPageTiles: params.perPageTiles,
                    filters: params.filters,
                },
                {
                    ...noCacheFetchPolicy,
                    context: {
                        skipLoading: true,
                    },
                },
            )
            .valueChanges.pipe(
                first(),
                map((result: ApolloQueryResult<AccountListFlowsQuery>) => {
                    return result.data;
                }),
            );
    }

    public accountDatasetsWithFlows(accountName: string): Observable<AccountListDatasetsWithFlowsQuery> {
        return this.accountListDatasetsWithFlowsGql
            .watch(
                { name: accountName },
                {
                    ...noCacheFetchPolicy,
                    context: {
                        skipLoading: true,
                    },
                },
            )
            .valueChanges.pipe(
                map((result: ApolloQueryResult<AccountListDatasetsWithFlowsQuery>) => {
                    return result.data;
                }),
            );
    }

    public accountFlowsPaused(accountName: string): Observable<AccountDatasetFlowsPausedQuery> {
        return this.accountDatasetFlowsPausedGql.watch({ accountName }, noCacheFetchPolicy).valueChanges.pipe(
            map((result: ApolloQueryResult<AccountDatasetFlowsPausedQuery>) => {
                return result.data;
            }),
        );
    }

    public accountPauseFlows(accountName: string): Observable<AccountPauseFlowsMutation> {
        return this.accountPauseFlowsGql
            .mutate({
                accountName,
            })
            .pipe(
                first(),
                map((result: MutationResult<AccountPauseFlowsMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }

    public accountResumeFlows(accountName: string): Observable<AccountResumeFlowsMutation> {
        return this.accountResumeFlowsGql
            .mutate({
                accountName,
            })
            .pipe(
                first(),
                map((result: MutationResult<AccountResumeFlowsMutation>) => {
                    /* istanbul ignore else */
                    if (result.data) {
                        return result.data;
                    } else {
                        throw new DatasetOperationError(result.errors ?? []);
                    }
                }),
            );
    }

    public deleteAccountByName(accountName: string): Observable<DeleteAccountByNameMutation> {
        return this.deleteAccountByNameGQL
            .mutate({
                accountName,
            })
            .pipe(
                first(),
                map((result: MutationResult<DeleteAccountByNameMutation>) => {
                    return result.data as DeleteAccountByNameMutation;
                }),
            );
    }
}
