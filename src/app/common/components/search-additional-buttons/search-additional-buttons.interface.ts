/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SearchAdditionalButtonsEnum } from "src/app/search/search.interface";

export type SearchAdditionalHeaderButtonOptions = Record<
    SearchAdditionalButtonsEnum,
    SearchAdditionalHeaderButtonInterface
>;

export interface SearchAdditionalHeaderButtonInterface {
    id: string;
    textButton: string;
    value: SearchAdditionalButtonsEnum;
    styleClassContainer?: string;
    styleClassButton?: string;
    icon: string;
    counter: number;
    additionalOptions: {
        title: string;
        disabled: boolean;
        options: {
            title: string;
            text: string;
            isSelected: boolean;
            value: string;
            action: SearchAdditionalHeaderButtonMenuAction;
        }[];
    };
}

export enum SearchAdditionalHeaderButtonMenuAction {
    CreateDataset = "createDataset",
    NavigateToDataset = "navigateToDataset",
    SetNotificationsMode = "setNotificationsMode",
}

export interface MenuActionData {
    value: string;
    action: SearchAdditionalHeaderButtonMenuAction;
}

export interface SearchAdditionalHeaderDownStreamsCount {
    count: number;
}
