export function Footer() {
  return (
    <footer className="border-t border-border/70 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center sm:px-6">
        <p className="text-sm text-muted-foreground">
          内容改编自 dg-ai-notes 开源教程（CC-BY-SA-4.0），本站内容以相同许可共享；Pi 项目本身为 MIT。
        </p>
        <p className="font-mono text-xs text-muted-foreground/70">
          © {new Date().getFullYear()} PI agent学习指南 · 个人学习笔记站点，与 Pi 官方无隶属关系
        </p>
      </div>
    </footer>
  );
}
