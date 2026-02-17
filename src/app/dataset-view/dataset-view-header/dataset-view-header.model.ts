/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { SearchAdditionalButtonsEnum } from "src/app/search/search.interface";

import {
    SearchAdditionalHeaderButtonInterface,
    SearchAdditionalHeaderButtonMenuAction,
} from "@common/components/search-additional-buttons/search-additional-buttons.interface";

export const SEARCH_ADDITIONAL_BUTTONS_DESCRIPTORS: SearchAdditionalHeaderButtonInterface[] = [
    {
        id: "search.starred",
        value: SearchAdditionalButtonsEnum.Starred,
        textButton: "Starred",
        counter: 2,
        icon: "starred",
        additionalOptions: {
            title: "",
            disabled: true,
            options: [],
        },
    },
    {
        id: "search.unwatch",
        value: SearchAdditionalButtonsEnum.UnWatch,
        textButton: "Unwatch",
        counter: 1,
        icon: "watch",
        additionalOptions: {
            title: "Notifications",
            disabled: true,
            options: [
                {
                    title: "Participating and @mentions",
                    text: "Only receive notifications from this repository when participating or @mentioned.",
                    value: "participating",
                    isSelected: false,
                    action: SearchAdditionalHeaderButtonMenuAction.SetNotificationsMode,
                },
                {
                    title: "All Activity",
                    text: "Notified of all notifications on this repository.",
                    value: "all",
                    isSelected: true,
                    action: SearchAdditionalHeaderButtonMenuAction.SetNotificationsMode,
                },
                {
                    title: "Ignore",
                    text: "Never be notified.",
                    value: "ignore",
                    isSelected: false,
                    action: SearchAdditionalHeaderButtonMenuAction.SetNotificationsMode,
                },
            ],
        },
    },
    {
        id: "search.derive",
        value: SearchAdditionalButtonsEnum.DeriveFrom,
        textButton: "Derive from",
        icon: "derive",
        counter: 0,
        additionalOptions: {
            disabled: false,
            title: "Existing derivative datasets",
            options: [
                {
                    title: "+ Create a new dataset",
                    text: "",
                    value: "createDataset",
                    isSelected: false,
                    action: SearchAdditionalHeaderButtonMenuAction.CreateDataset,
                },
            ],
        },
    },
];
