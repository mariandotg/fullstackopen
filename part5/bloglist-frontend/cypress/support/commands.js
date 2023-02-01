Cypress.Commands.add("login", ({ username, password }) => {
    cy.request("POST", "http://localhost:3003/api/login", {
      username,
      password
    }).then(({body}) => {
      localStorage.setItem("FSOpenBlogListAppUser", JSON.stringify(body));
      cy.visit("http://localhost:3000");
    });
  });
  
Cypress.Commands.add("createBlog", ({ title, author, url }) => {
    const token = JSON.parse(localStorage.getItem("FSOpenBlogListAppUser")).token
    cy.request({
        url: "http://localhost:3003/api/blogs",
        method: "POST",
        body: { title, author, url },
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    cy.visit("http://localhost:3000");
});