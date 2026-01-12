import React from "react";
import { render, screen } from "@testing-library/react";

import HomePage from "../app/page";

describe("Home page", () => {
  it("renders without crashing", () => {
    render(<HomePage />);
    // We don't assume exact copy; just ensure something user-visible is present.
    expect(document.body.textContent).toBeTruthy();
  });

  it("includes a heading element", () => {
    render(<HomePage />);
    expect(screen.getAllByRole("heading").length).toBeGreaterThan(0);
  });
});

