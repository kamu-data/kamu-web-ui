/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ModalDialogComponent } from "../common/components/modal/modal-dialog.component";
import { ModalImageComponent } from "../common/components/modal/modal-image.component";
import { ModalSpinnerComponent } from "../common/components/modal/modal-spinner.component";
import { MaybeNull } from "./app.types";

export interface ModalCommandInterface {
    type: ModalComponentType;
    context: ModalArgumentsInterface;
}

export interface ModalArgumentsInterface {
    title?: string;
    message?: string;
    description?: string;
    listDescription?: string[];
    bigTextBlock?: string;
    warningText?: string;
    status?: string;
    yesButtonText?: string;
    noButtonText?: string;
    lastButtonText?: string;
    tooLastButtonText?: string;
    handler?: (arg: string | boolean) => void;
    data?: undefined;
    locationBack?: boolean;
    idFilterButton?: string;
    filter_data?: ModalFilterArgumentInterface[][];
    position?: DOMRect;
    style?: ModalStyles;
    type?: string;
    _close?: (locationBack?: boolean) => void;
}

export interface ModalStyles {
    isMinContent?: boolean;
    width?: string;
    borderRadius?: string;
}

export interface ModalFilterArgumentInterface {
    value: string;
    title: string;
    active: boolean;
}

export interface ModalMappingsComponent {
    dialog: typeof ModalDialogComponent;
    image: typeof ModalImageComponent;
    spinner: typeof ModalSpinnerComponent;
}

export type ModalComponentType = "dialog" | "image" | "spinner";

export type NgStyleValue = MaybeNull<Record<string, string>>;
