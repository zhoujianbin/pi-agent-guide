import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import ModelGuidePage from "./ModelGuidePage";

function renderPage() {
  return render(
    <MemoryRouter>
      <ModelGuidePage />
    </MemoryRouter>,
  );
}

describe("国产模型选型指南", () => {
  it("展示可直达方舟邀请订阅页的优惠入口", () => {
    renderPage();

    expect(screen.getByRole("heading", { name: /国产模型选型指南/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "立即订阅方舟 Coding Plan" })).toHaveAttribute(
      "href",
      "https://volcengine.com/L/EXCINM7Q_JA/",
    );
  });

  it("复制邀请码后给出已复制反馈", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText },
      configurable: true,
    });
    renderPage();

    const copyButton = screen.getByRole("button", { name: /复制邀请码/ });
    await user.click(copyButton);

    expect(writeText).toHaveBeenCalledWith("UBXND2JL");
    expect(screen.getByRole("button", { name: /已复制/ })).toBeInTheDocument();
  });
});
