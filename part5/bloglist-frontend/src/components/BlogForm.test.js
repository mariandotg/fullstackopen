import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

describe("<BlogForm />", () => {
  let component
  const createBlog = jest.fn()
  const user = userEvent.setup()

  beforeEach(() => {
    component = render(
      <BlogForm createBlog={createBlog} />
    )
  })

  test("Check if the form calls the event handler with the right details, when create button is created", async () => {
    const titleInput = component.container.querySelector("input[name='title']");
    const authorInput = component.container.querySelector("input[name='author']");
    const urlInput = component.container.querySelector("input[name='url']");
    const sendButton = screen.getByText("create");

    await user.type(titleInput, "Blog test");
    await user.type(authorInput, "Mariano Guillaume");
    await user.type(urlInput, "https://www.marianoguillaume.com");
    await user.click(sendButton);

    expect(createBlog.mock.calls).toHaveLength(1);
    expect(createBlog.mock.calls[0][0]).toBe("Blog test");
    expect(createBlog.mock.calls[0][1]).toBe("Mariano Guillaume");
    expect(createBlog.mock.calls[0][2]).toBe("https://www.marianoguillaume.com");
  })
})