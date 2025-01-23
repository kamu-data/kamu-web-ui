import { inject, Input, OnInit } from "@angular/core";
import { ChangeDetectionStrategy, Component } from "@angular/core";
import { ChangeEmailFormType } from "./email-tabs.types";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { RxwebValidators } from "@rxweb/reactive-form-validators";
import { AccountEmailService } from "src/app/services/account-email.service";
import { AccountFragment } from "src/app/api/kamu.graphql.interface";

@Component({
    selector: "app-emails-tab",
    templateUrl: "./emails-tab.component.html",
    styleUrls: ["./emails-tab.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailsTabComponent implements OnInit {
    @Input({ required: true }) public account: AccountFragment;

    public changeEmailForm: FormGroup<ChangeEmailFormType>;
    private fb = inject(FormBuilder);
    private accountEmailService = inject(AccountEmailService);

    get emailAddress(): FormControl<string> {
        return this.changeEmailForm.get("emailAddress") as FormControl<string>;
    }

    public ngOnInit(): void {
        this.changeEmailForm = this.fb.nonNullable.group({
            emailAddress: ["", [Validators.required, RxwebValidators.email()]],
        });
    }

    public changeEmailAddress(): void {
        this.accountEmailService.changeEmailAddress({
            accountName: this.account.accountName,
            currentEmailAddress: this.emailAddress.value,
        });
    }
}
