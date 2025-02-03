import { EventEmitter, inject, Input, OnInit, Output } from "@angular/core";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ChangeEmailFormType } from "./email-tabs.types";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { AccountEmailService } from "src/app/services/account-email.service";
import { AccountWithEmailFragment } from "src/app/api/kamu.graphql.interface";
import { Observable } from "rxjs";

@Component({
    selector: "app-emails-tab",
    templateUrl: "./emails-tab.component.html",
    styleUrls: ["./emails-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailsTabComponent implements OnInit {
    @Input({ required: true }) public account: AccountWithEmailFragment;
    @Output() public accountEmailChange = new EventEmitter();

    public changeEmailForm: FormGroup<ChangeEmailFormType>;
    public changeEmailError$: Observable<string>;
    private fb = inject(FormBuilder);
    private accountEmailService = inject(AccountEmailService);

    public get emailAddress(): FormControl<string> {
        return this.changeEmailForm.get("emailAddress") as FormControl<string>;
    }

    public ngOnInit(): void {
        this.changeEmailForm = this.fb.nonNullable.group({
            emailAddress: [this.account.email, [Validators.required, RxwebValidators.email()]],
        });
        this.changeEmailError$ = this.accountEmailService.renameAccountEmailErrorOccurrences;
    }

    public changeEmail(): void {
        this.accountEmailService.resetChangeEmailError();
    }

    public changeEmailAddress(): void {
        this.accountEmailService
            .changeEmailAddress({
                accountName: this.account.accountName,
                newEmail: this.emailAddress.value,
            })
            .subscribe((result: boolean) => {
                if (result) {
                    this.accountEmailChange.emit();
                }
            });
    }
}
