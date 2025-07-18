/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

export interface JwtPayload {
    exp: number;
    iat?: number;
    [key: string]: unknown;
}
