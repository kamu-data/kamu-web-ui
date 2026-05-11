/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { mockCollectionEntryConnection } from "src/app/search/mock.data";

import { getCollectionValueHelper, resolveEntryIconHelper, sortCollectionEntryData } from "./collection-view.helper";
import { CollectionEntryViewType, CollectionViewNode } from "./collection-view.model";

[
    { case: [], expected: "-" },
    { case: null, expected: "-" },
    { case: undefined, expected: "-" },
    { case: "", expected: "-" },
    { case: ["one", "two"], expected: "one, two" },
    { case: "test-value", expected: "test-value" },
].forEach((item: { case: unknown; expected: string }) => {
    it(`should check #getCollectionValueHelper with ${item.case}`, () => {
        expect(getCollectionValueHelper(item.case)).toEqual(item.expected);
    });
});

[
    {
        case: {
            displayName: "test-file",
            nodeType: CollectionViewNode.File,
            alias: "account/test-file",
            systemTime: "2025-11-12T12:22:04.577+00:00",
            hash: "ewqeqwdsd1sl5l3lfdsfdsf",
            size: 255548,
            owner: {
                accountName: "twest",
            },
            contentType: "application/pdf",
            extraData: {},
        },
        expected: "pdf",
    },
    {
        case: {
            displayName: "test-folder",
            nodeType: CollectionViewNode.Folder,
            alias: null,
            systemTime: "2025-11-12T12:22:04.577+00:00",
            hash: null,
            size: 0,
            owner: null,
            contentType: null,
            extraData: {},
        },
        expected: "collection-folder",
    },
    {
        case: {
            displayName: "test-folder",
            nodeType: CollectionViewNode.Dataset,
            alias: "account/test-dataset",
            systemTime: "2025-11-12T12:22:04.577+00:00",
            hash: "wqwqwewe",
            size: 123,
            owner: null,
            contentType: null,
            extraData: {},
        },
        expected: "database",
    },
    {
        case: {
            displayName: "test-folder",
            nodeType: CollectionViewNode.Broken,
            alias: null,
            systemTime: "2025-11-12T12:22:04.577+00:00",
            hash: null,
            size: 123,
            owner: null,
            contentType: null,
            extraData: {},
        },
        expected: "question",
    },
].forEach((item: { case: CollectionEntryViewType; expected: string }) => {
    it(`should check #resolveEntryIconHelper with ${item.case.nodeType}`, () => {
        expect(resolveEntryIconHelper(item.case)).toEqual(item.expected);
    });
});

it(`should check #sortCollectionEntryData`, () => {
    const result = sortCollectionEntryData(mockCollectionEntryConnection.nodes, 0).map((item) => item.displayName);
    expect(result).toEqual([
        "test-folder",
        "did:odf:fed01d359748f8a105f641667907569ef8b2b8b7e5093d5b94b19b89bee60c00f1277",
        "dummy.pdf",
        "e61fa65-507e-4289-af19-dab466fa8620.png",
    ]);
});
