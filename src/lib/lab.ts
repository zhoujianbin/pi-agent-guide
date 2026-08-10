import lab01 from "../../content/lab/lab01.md?raw";
import lab02 from "../../content/lab/lab02.md?raw";
import lab03 from "../../content/lab/lab03.md?raw";
import lab04 from "../../content/lab/lab04.md?raw";
import lab05 from "../../content/lab/lab05.md?raw";
import { parseFrontmatter } from "@/lib/chapters";

export interface LabDoc {
  step: number;
  title: string;
  subtitle: string;
  tags: string[];
  body: string;
}

const raws = [lab01, lab02, lab03, lab04, lab05];

function toDoc(raw: string, fallbackStep: number): LabDoc {
  const { data, body } = parseFrontmatter(raw);
  return {
    step: Number(data.step ?? fallbackStep),
    title: String(data.title ?? `第 ${fallbackStep} 关`),
    subtitle: String(data.subtitle ?? ""),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    body,
  };
}

export const labs: LabDoc[] = raws.map((raw, i) => toDoc(raw, i + 1));

export function getLab(step: number): LabDoc | undefined {
  return labs.find((l) => l.step === step);
}
