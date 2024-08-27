import { FormControl } from "@angular/forms";

export interface EnvAndSecretsFormType {
    keyEnvVariable: FormControl<string>;
    value: FormControl<string>;
    isSecret: FormControl<boolean>;
}
