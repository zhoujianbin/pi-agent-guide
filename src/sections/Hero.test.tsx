import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { Hero } from "./Hero";

describe("首页首屏入口", () => {
  it("提供实战与国产模型选型指南直达链接", () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /实战闯关/ })).toHaveAttribute("href", "/lab/");
    expect(screen.getByRole("link", { name: /国产模型选型指南/ })).toHaveAttribute(
      "href",
      "/model-guide/",
    );
    expect(screen.getByText("含羊毛")).toBeInTheDocument();
  });
});
