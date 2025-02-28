/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { Injectable } from "@angular/core";
import { ModalArgumentsInterface, ModalCommandInterface } from "../../../interface/modal.interface";
import { Subject } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class ModalService {
    /**
     * @example
     * - show an image:
     * this.modalService.showImage("https://bizibazapics.s3.amazonaws.com/SA1/148136152005080520165418.jpg");
     *
     * - close the modal window
     * this.modalService.close();
     *
     * - show warning and handle users choice
     * this.modalService.
     *      .warning({
     *           title:          'Hello!',
     *           message:        'Do you like this modal?',
     *           yesButtonText:  'Yes',
     *           noButtonText:   'Probably',
     *       })
     * .then(action => console.log('User said: ', action));
     */

    private showModal$: Subject<ModalCommandInterface> = new Subject<ModalCommandInterface>();
    private currentModalType = "dialog";

    /**
     * Setter for type of currently displayed modal.
     */
    public set modalType(type: string) {
        this.currentModalType = type;
    }

    /**
     * Getter for type of currently displayed modal.
     */
    public get modalType(): string {
        return this.currentModalType;
    }

    public success(options: ModalArgumentsInterface): Promise<boolean | string> {
        return this._showDialog(Object.assign(options, { status: "ok" }));
    }

    public warning(options: ModalArgumentsInterface): Promise<boolean | string> {
        return this._showDialog(Object.assign(options, { status: "warning" }));
    }

    public error(options: ModalArgumentsInterface): Promise<boolean | string> {
        return this._showDialog(Object.assign(options, { status: "error" }));
    }

    public dialog_question(options: ModalArgumentsInterface): Promise<boolean | string> {
        return this._showDialog(Object.assign(options, { status: "dialog_question" }));
    }

    private _showDialog(context: ModalArgumentsInterface): Promise<boolean | string> {
        this.showModal$.next({
            type: "dialog",
            context,
        });

        return new Promise((resolve) => {
            resolve(context.status ?? "");
        });
    }

    public showImage(url: string): void {
        this.showModal$.next({
            type: "image",
            context: {
                message: url,
            },
        });
    }

    public showSpinner(): void {
        this.showModal$.next({
            type: "spinner",
            context: {},
        });
    }

    public getCommand() {
        return this.showModal$.asObservable();
    }
}
