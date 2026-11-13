import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vitest";
import { Hero } from "./Hero";

describe("首页首屏入口", () => {
  it("提供实战直达链接，不展示模型选型按钮", () => {
    render(
      <MemoryRouter>
        <Hero />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /实战闯关/ })).toHaveAttribute("href", "/lab/");
    expect(screen.queryByRole("link", { name: /国产模型选型指南/ })).not.toBeInTheDocument();
    expect(screen.queryByText("含羊毛")).not.toBeInTheDocument();
  });
});
