describe("Blog app", () => {
  beforeEach(() => {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "Mariano Guillaume",
      username: "marianoguillaume",
      password: "password",
    };
    cy.request("POST", "http://localhost:3003/api/users/", user);
    cy.visit("http://localhost:3000");
  });

  it("Login form is shown", () => {
    cy.contains("log in to application");
  });

  describe("Login", () => {
    it("Succeeds with correct credentials", () => {
      cy.get("#username").type("marianoguillaume");
      cy.get("#password").type("password");
      cy.get("#login-btn").click();
      cy.contains("Mariano Guillaume logged in");
    });

    it("Fails with wrong credentials", () => {
      cy.get("#username").type("testing");
      cy.get("#password").type("wrong");
      cy.get("#login-btn").click();
      cy.get(".error")
        .should("contain", "invalid username or password")
        .and("have.css", "color", "rgb(255, 0, 0)")
        .and("have.css", "border-style", "solid");

      cy.get("html").should("not.contain", "Mariano Guillaume logged in");
    });
  });
});