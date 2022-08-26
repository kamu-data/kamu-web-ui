import { ModalFilterComponent } from "../components/modal/modal-filter.component";
import { ModalDialogComponent } from "../components/modal/modal-dialog.component";
import { ModalImageComponent } from "../components/modal/modal-image.component";
import { BlankComponent } from "../components/modal/blank.component";
import { ModalSpinnerComponent } from "../components/modal/modal-spinner.component";

export interface ModalCommandInterface {
    type: ModalComponentType;
    context: ModalArgumentsInterface;
}

export interface ModalArgumentsInterface {
    title?: string;
    message?: string;
    bigTextBlock?: string;
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
    filter: typeof ModalFilterComponent;
    dialog: typeof ModalDialogComponent;
    image: typeof ModalImageComponent;
    blank: typeof BlankComponent;
    spinner: typeof ModalSpinnerComponent;
}

export type ModalComponentType =
    | "blank"
    | "dialog"
    | "image"
    | "spinner"
    | "filter";

export type NgStyleValue = Record<string, string> | null;
