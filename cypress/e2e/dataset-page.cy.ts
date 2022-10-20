import ProjectLinks from "../../src/app/project-links";

describe("Dataset page", () => {
    beforeEach(() => {
        cy.intercept("POST", "/graphql").as("graphqlRequest");
        cy.visit(Cypress.env("initDatasetName") as string);
        cy.wait("@graphqlRequest");
    });

    it("Visits dataset component page", () => {
        cy.url().should("include", Cypress.env("initDatasetName") as string);
        cy.url().should("not.include", "?tab=");
        cy.contains(
            "Confirmed positive cases of COVID-19 in British Columbia",
        ).should("be.visible");
    });

    it("Check switch tabs", () => {
        ["data", "metadata", "history", "lineage"].forEach(
            (tab: string, index: number) => {
                cy.get("mat-button-toggle-group")
                    .find("button")
                    .eq(index + 1)
                    .click();
                cy.url().should("include", `?tab=${tab}`);
            },
        );
    });

    it("Should show page 404 when url include wrong name dataset and redirect to home page", () => {
        cy.visit("/kamu/british-columbia-error.case-details");
        cy.wait("@graphqlRequest").then(() => {
            cy.get(".error-template")
                .find("h2")
                .should("have.text", "404 Not Found");
            cy.get(".error-template")
                .find("button")
                .should("have.text", "Take me home ");
            cy.get(".error-template").find("button").click();
            cy.url().should("include", ProjectLinks.urlSearch);
        });
    });

    it("Should check run valid sql query", () => {
        const validQuery = "select offset from 'british-columbia.case-details'";
        cy.visit(`${Cypress.env("initDatasetName") as string}?tab=data`);
        cy.wait("@graphqlRequest");
        cy.get('[style="top:0px;height:19px;"]')
            .should("be.visible")
            .then(() => {
                cy.contains("'british-columbia.case-details'").should(
                    "have.class",
                    "mtk4",
                );
                cy.get("ngx-monaco-editor")
                    .click()
                    .focused()
                    .type("{ctrl}a")
                    .type(validQuery);
                cy.get(
                    ".sql-query-editor-header > .btnGroup-parent > .sql-run-button",
                ).click();
                cy.get("app-dynamic-table").should("exist");
            });
    });

    it("Should check run invalid sql query", () => {
        const invalidQuery = "failed query";
        cy.visit(`${Cypress.env("initDatasetName") as string}?tab=data`);
        cy.wait("@graphqlRequest");
        cy.get('[style="top:0px;height:19px;"]')
            .should("be.visible")
            .then(() => {
                cy.get("ngx-monaco-editor")
                    .click()
                    .focused()
                    .type("{ctrl}a")
                    .type(invalidQuery);
                cy.get(
                    ".sql-query-editor-header > .btnGroup-parent > .sql-run-button",
                ).click();
                cy.contains("Incorrect SQL query.").should("exist");
            });
    });

    it("Should check metadata tab init", () => {
        cy.visit(`${Cypress.env("initDatasetName") as string}?tab=metadata`);
        cy.wait("@graphqlRequest");
        cy.contains("OGL-Canada-2.0").should("be.visible");
    });

    it("Should check change dataset on the lineage tab", () => {
        cy.visit(`${Cypress.env("initDatasetName") as string}?tab=lineage`);
        cy.wait("@graphqlRequest");
        cy.get(".node-group").eq(2).click();
        cy.url().should("include", "/kamu/canada.case-details?tab=lineage");
    });
});
