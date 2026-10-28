/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { ValidatorFn, Validators } from "@angular/forms";

import { ENV_VAR_KEY_MAX_LENGTH, ODF_NAME_MAX_LENGTH, ValidationPatterns } from "@common/validation/patterns";
import { formatValidator } from "@common/validation/text.validators";

/** A dataset or account name as kamu-cli parses it. */
export function odfNameValidators(): ValidatorFn[] {
    return [Validators.maxLength(ODF_NAME_MAX_LENGTH), formatValidator(ValidationPatterns.ODF_NAME)];
}

/** A dataset variable or secret key as kamu-cli accepts it. */
export function envVarKeyValidators(): ValidatorFn[] {
    return [Validators.maxLength(ENV_VAR_KEY_MAX_LENGTH), formatValidator(ValidationPatterns.ENV_VAR_KEY)];
}
