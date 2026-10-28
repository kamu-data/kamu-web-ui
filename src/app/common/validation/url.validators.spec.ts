/**
 * Copyright Kamu Data, Inc. and contributors. All rights reserved.
 *
 * Use of this software is governed by the Business Source License
 * included in the LICENSE file.
 */

import { FormControl } from "@angular/forms";

import { urlValidator } from "@common/validation/url.validators";

describe("urlValidator", () => {
    const httpOrHttps = urlValidator(["http", "https"]);
    const httpsOnly = urlValidator(["https"]);

    ["", "http://example.com", "https://example.com/path?q=1", "HTTPS://Example.com", "http://localhost:8080"].forEach(
        (value) => {
            it(`should accept ${JSON.stringify(value)} for http and https`, () => {
                expect(httpOrHttps(new FormControl(value))).toBeNull();
            });
        },
    );

    [
        "http://",
        "https://",
        "example.com",
        "foo https://example.com",
        "ftp://example.com",
        "http://exa mple.com",
    ].forEach((value) => {
        it(`should reject ${JSON.stringify(value)} for http and https`, () => {
            expect(httpOrHttps(new FormControl(value))).toEqual({ url: { schemes: ["http", "https"] } });
        });
    });

    describe("with kamu-cli templates", () => {
        const withTemplates = urlValidator(["http", "https"], { templates: true });

        [
            "https://example.com/data.csv?key=${{ env.API_KEY }}",
            "https://${{ env.HOST }}/data.csv",
            "https://example.com/${{ env.PATH || 'latest' }}.csv",
            "${{ env.SOURCE_URL }}",
        ].forEach((value) => {
            it(`should accept ${JSON.stringify(value)}`, () => {
                expect(withTemplates(new FormControl(value))).toBeNull();
            });
        });

        ["ftp://example.com/${{ env.FILE }}", "${{ env.HOST }}/data.csv", "https://example.com/a b"].forEach(
            (value) => {
                it(`should reject ${JSON.stringify(value)}`, () => {
                    expect(withTemplates(new FormControl(value))).toEqual({ url: { schemes: ["http", "https"] } });
                });
            },
        );

        it("should reject a template where templates are not substituted", () => {
            expect(httpOrHttps(new FormControl("https://example.com/?key=${{ env.API_KEY }}"))).toEqual({
                url: { schemes: ["http", "https"] },
            });
        });
    });

    it("should reject http when only https is allowed", () => {
        expect(httpsOnly(new FormControl("http://example.com"))).toEqual({ url: { schemes: ["https"] } });
        expect(httpsOnly(new FormControl("https://example.com"))).toBeNull();
    });
});
