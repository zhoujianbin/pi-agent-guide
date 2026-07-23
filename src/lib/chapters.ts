import ch01 from "../../content/chapters/ch01.md?raw";
import ch02 from "../../content/chapters/ch02.md?raw";
import ch03 from "../../content/chapters/ch03.md?raw";
import ch04 from "../../content/chapters/ch04.md?raw";
import ch05 from "../../content/chapters/ch05.md?raw";
import ch06 from "../../content/chapters/ch06.md?raw";
import ch07 from "../../content/chapters/ch07.md?raw";
import ch08 from "../../content/chapters/ch08.md?raw";
import ch09 from "../../content/chapters/ch09.md?raw";
import ch10 from "../../content/chapters/ch10.md?raw";

export interface InterviewItem {
  q: string;
  a: string;
}

export interface ChapterDoc {
  id: number;
  title: string;
  subtitle: string;
  tags: string[];
  interview: InterviewItem[];
  body: string;
}

const stripQuotes = (s: string) =>
  s.trim().replace(/^["']|["']$/g, "").trim();

type ListItem = string | Record<string, string>;

/** 轻量 frontmatter 解析：标量、[a, b] 行内列表、- item 字符串列表、- q:/a: 对象列表 */
function parseFrontmatter(raw: string): { data: Record<string, string | string[] | ListItem[]>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { data: {}, body: raw };

  const data: Record<string, string | string[] | ListItem[]> = {};
  const lines = match[1].split(/\r?\n/);
  let currentKey: string | null = null;

  for (const line of lines) {
    // 对象列表项：- key: value
    const objItem = line.match(/^\s+-\s+([A-Za-z_][\w-]*)\s*:\s*(.+)$/);
    if (objItem && currentKey) {
      const arr = (data[currentKey] as ListItem[]) ?? [];
      arr.push({ [objItem[1]]: stripQuotes(objItem[2]) });
      data[currentKey] = arr;
      continue;
    }
    // 字符串列表项：- item
    const strItem = line.match(/^\s+-\s+(.*)$/);
    if (strItem && currentKey) {
      const arr = (data[currentKey] as ListItem[]) ?? [];
      arr.push(stripQuotes(strItem[1]));
      data[currentKey] = arr;
      continue;
    }
    // 对象列表项的后续字段：  key: value（缩进，挂在最后一个对象上）
    const objField = line.match(/^\s{2,}([A-Za-z_][\w-]*)\s*:\s*(.+)$/);
    if (objField && currentKey) {
      const arr = data[currentKey];
      if (Array.isArray(arr) && arr.length > 0) {
        const last = arr[arr.length - 1] as ListItem;
        if (typeof last === "object") {
          last[objField[1]] = stripQuotes(objField[2]);
          continue;
        }
      }
    }
    // 普通键值对
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (kv) {
      const [, key, value] = kv;
      currentKey = key;
      if (value === "") {
        data[key] = [];
      } else if (value.startsWith("[") && value.endsWith("]")) {
        data[key] = value
          .slice(1, -1)
          .split(",")
          .map(stripQuotes)
          .filter(Boolean);
      } else {
        data[key] = stripQuotes(value);
      }
    }
  }

  return { data, body: raw.slice(match[0].length) };
}

function toDoc(raw: string, fallbackId: number): ChapterDoc {
  const { data, body } = parseFrontmatter(raw);
  const interviewRaw = Array.isArray(data.interview) ? (data.interview as ListItem[]) : [];
  const interview: InterviewItem[] = interviewRaw
    .map((item) =>
      typeof item === "object"
        ? { q: String(item.q ?? ""), a: String(item.a ?? "") }
        : { q: String(item), a: "" },
    )
    .filter((item) => item.q);
  return {
    id: Number(data.chapter ?? fallbackId),
    title: String(data.title ?? `第 ${fallbackId} 章`),
    subtitle: String(data.subtitle ?? ""),
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    interview,
    body,
  };
}

const raws = [ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10];

export const chapters: ChapterDoc[] = raws.map((raw, i) => toDoc(raw, i + 1));

export function getChapter(id: number): ChapterDoc | undefined {
  return chapters.find((c) => c.id === id);
}
