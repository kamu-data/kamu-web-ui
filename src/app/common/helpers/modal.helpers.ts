/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Type } from "@angular/core";

import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";

export interface OpenedModal<T> {
    modalRef: NgbModalRef;
    instance: T;
}

/** Opens `component` in a modal and returns the modal with the instance it created, to set its inputs on. */
export function openModal<T>(ngbModal: NgbModal, component: Type<T>, options: NgbModalOptions = {}): OpenedModal<T> {
    const modalRef = ngbModal.open(component, options);
    const instance: unknown = modalRef.componentInstance;
    if (instance instanceof component) {
        return { modalRef, instance };
    }
    throw new Error(`Expecting the modal to hold a ${component.name}`);
}
