import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import FileDocs from "./FileDocs";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});


it("The user click open file and the filelists will show in buttons.", async () => {
  await act( async () => {
    render(<FileDocs />, container);
  });

  const buttonElement = screen.getByRole("button", { name: /Open File/i });
  fireEvent.click(buttonElement);

  await waitFor(async() => {

    const  filelist = await screen.findByTitle('filelist');

    expect(filelist.firstElementChild).toHaveTextContent("test5");
  });
});

it("The user will see 4 buttons for operating files.", async () => {
  act( () => {
    render(<FileDocs />, container);
  });
  const buttonElements = screen.getAllByRole("button");

  expect(buttonElements).toHaveLength(4);
});



it("The user click new file and current filename is empty.", async () => {
 act(() => {
    render(<FileDocs />, container);
  });
  const buttonElement = screen.getByRole("button", { name: /New File/i });
  fireEvent.click(buttonElement);
  const current_file = screen.getByTitle("current_file");

  expect(current_file.textContent).toBe(" Current File: ");
});
