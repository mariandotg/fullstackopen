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

    describe("When logged in", () => {
      beforeEach(() => {
        cy.login({ username: "marianoguillaume", password: "password" });
      });
  
      it('A new blog can be created', () => {
        cy.createBlog({
          title: "A blog created by Mariano Guillaume",
          author: "Mariano Guillaume",
          url: "https://www.marianoguillaume.com/",
        });
  
        cy.contains("A blog created by Mariano Guillaume");
      })

      describe("And several blogs exist", () => {
        beforeEach(() => {
          cy.createBlog({
            title: "First blog",
            author: "Mariano Guillaume",
            url: "https://www.test1.com/",
          });
          cy.createBlog({
            title: "Second blog",
            author: "Mariano Guillaume",
            url: "https://www.test2.com/",
          });
          cy.createBlog({
            title: "Third blog",
            author: "Mariano Guillaume",
            url: "https://www.test3.com/",
          });
        });

        it("One of those can be liked", () => {
          cy.contains("Third blog").parent().find("button").click();
          cy.get("#like-btn").click();
        });

        it("One of those can be deleted", () => {
          cy.contains("Second blog").parent().find("button").click();
          cy.get("#delete-btn").click();
          cy.get("html").should("not.contain", "Second blog");
        });

        it("Only user that created the blog can view the delete button", () => {
          cy.contains("Second blog").parent().find("button").click();
          cy.get("html").should("contain", "delete");
          cy.logout();
          const user = {
            name: "Fullstackopen",
            username: "fullstackopen",
            password: "password",
          };
          cy.request("POST", "http://localhost:3003/api/users/", user);
          cy.visit("http://localhost:3000");
          cy.login({ username: "fullstackopen", password: "password"});
          cy.contains("Second blog").parent().find("button").click();
          cy.get("html").should("not.contain", "delete");
        });

        it("They are ordered by the number of likes in descending order", async () => {
          cy.contains("Third blog").parent().find("button").click();
          cy.get("#like-btn").click().wait(500).click().wait(500);
          cy.contains("Third blog").parent().find("button").click();
  
          cy.contains("Second blog").parent().find("button").click();
          cy.get("#like-btn")
            .click()
            .wait(500)
            .click()
            .wait(500)
            .click()
            .wait(500);
  
          cy.get(".blog-style").eq(0).should("contain", "Second blog");
          cy.get(".blog-style").eq(1).should("contain", "Third blog");
          cy.get(".blog-style").eq(2).should("contain", "First blog");
        });
      })
    });
  });


});