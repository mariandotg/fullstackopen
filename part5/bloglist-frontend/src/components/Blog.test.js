import "@testing-library/jest-dom/extend-expect"
import { render, fireEvent } from "@testing-library/react"
import Blog from "./Blog"

describe("<Blog />", () => {
  let component
  const updateLikes = jest.fn()
  const deleteBlog = jest.fn()
  const blog = {
    title: "Title",
    author: "Author",
    url: "https://www.test.com/",
    likes: 0,
    user: {
      username: "username",
      name: "name",
      id: 0,
    },
  }

  beforeEach(() => {
    component = render(
      <Blog
        key={blog.id}
        blog={blog}
        updateLikes={updateLikes}
        deleteBlog={deleteBlog}
      />
    )
  })

  test("Displays title and author but not url or likes by default", () => {
    expect(component.container.querySelector(".title")).toHaveTextContent(
      blog.title
    )
    expect(component.container.querySelector(".author")).toHaveTextContent(
      blog.author
    )
    expect(component.queryByText(blog.url)).not.toBeInTheDocument()
    expect(component.queryByText("like")).not.toBeInTheDocument()
  })

  test("Displays blog details when view button is clicked", () => {
    const button = component.container.querySelector(".view-button")
    fireEvent.click(button)

    const blogDetails = component.container.querySelector(".blog-details")
    expect(blogDetails).toBeInTheDocument()
  })

  test("Check if the Like button is clicked twice, the event handler is also called twice", () => {
    const viewButton = component.getByText("show");
    fireEvent.click(viewButton);

    const likeButton = component.getByText("like");
    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(updateLikes.mock.calls).toHaveLength(2);
  });
})