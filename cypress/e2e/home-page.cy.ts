describe("Home page/search", () => {
    beforeEach(() => {
        cy.intercept("POST", "/graphql").as("graphqlRequest");
        cy.visit("/");
        cy.wait("@graphqlRequest");
    });

    it("Switch search result to second page", () => {
        cy.get(".pagination").find("li").eq(2).click();
        cy.url().should("include", "page=2");
    });

    it("Redirect to dataset page", () => {
        cy.get('[data-test-id="dataset-name-button-0"]').click();
        cy.url()
            .should("include", "alberta.case-details")
            .and("include", "kamu");
    });

    it("Check open search options equal all", () => {
        cy.get('[data-test-id="searchInput"]')
            .type("british")
            .should("have.value", "british");
        cy.get("ngb-typeahead-window").should("be.visible");
        cy.get("ngb-typeahead-window").find("button").eq(0).click();
        cy.location().should((loc) => {
            expect(loc.search).to.eq("?query=british");
        });
        cy.get(".dataset-list-container").should("have.length", 2);
    });

    it("Check open search options equal dataset name", () => {
        cy.get('[data-test-id="searchInput"]')
            .type("british")
            .should("have.value", "british");
        cy.get("ngb-typeahead-window").should("be.visible");
        cy.get("ngb-typeahead-window").find("button").eq(1).click();
        cy.url()
            .should("include", "british-columbia.case-details")
            .and("include", "kamu");
    });
});
