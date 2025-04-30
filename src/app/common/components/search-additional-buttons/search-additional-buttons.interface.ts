/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { searchAdditionalButtonsEnum } from "src/app/search/search.interface";

export type SearchAdditionalHeaderButtonOptions = Record<
    searchAdditionalButtonsEnum,
    SearchAdditionalHeaderButtonInterface
>;

export interface SearchAdditionalHeaderButtonInterface {
    id: string;
    textButton: string;
    styleClassContainer?: string;
    styleClassButton?: string;
    iconSvgPath: string;
    svgClass: string;
    iconSvgPathClass: string;
    counter?: number;
    additionalOptions?: {
        title?: string;
        options?: {
            title?: string;
            text?: string;
            isSelected?: boolean;
            value?: string;
        }[];
    };
}

export interface SearchAdditionalHeaderDatasetInputs {
    count: number;
}
