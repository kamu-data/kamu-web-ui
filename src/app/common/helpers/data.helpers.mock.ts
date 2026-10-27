/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { MetadataBlockFragment } from "@api/kamu.graphql.interface";

import { mockOwnerFieldsWithAvatar } from "src/app/search/mock.data";

/** A SetVocab metadata block. */
export const metadataBlockSetVocab: MetadataBlockFragment = {
    __typename: "MetadataBlockExtended",
    blockHash: "zW1fzwrGZbrvqoXujua5oxj4j466tDwXySjpVMi8BvZ2mtj",
    prevBlockHash: "zW1ioX6fdsM4so8MPw7wqF1uKsDC7n6FEkhahZKXNcgF5E1",
    sequenceNumber: 14,
    systemTime: "2022-08-05T21:19:28.817281255+00:00",
    author: {
        ...mockOwnerFieldsWithAvatar,
    },
    event: {
        __typename: "SetVocab",
        systemTimeColumn: null,
        eventTimeColumn: "case_reported_date",
        offsetColumn: null,
        operationTypeColumn: null,
    },
};
