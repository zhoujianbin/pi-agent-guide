import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LearningPath } from "./LearningPath";

describe("学习路径", () => {
  it("第 4 阶段标题为「长对话的工程挑战」", () => {
    render(<LearningPath />);

    expect(screen.getByRole("heading", { name: "长对话的工程挑战" })).toBeInTheDocument();
    expect(screen.queryByText("长生对话的工程问题")).not.toBeInTheDocument();
  });
});
