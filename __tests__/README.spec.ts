/**
 * Testing library and framework note: Using Jest (detected or defaulted for Next.js projects).
 * Purpose: Validate README.md structure and critical guidance from the recent diff.
 */
const fs = require("fs");
const path = require("path");

function loadReadme() {
  const candidates = [
    path.resolve(process.cwd(), "README.md"),
  ];
  const alt = process.env.README_ALT_PATH;
  if (alt) candidates.unshift(path.resolve(process.cwd(), alt));
  for (const p of candidates) {
    if (fs.existsSync(p)) return fs.readFileSync(p, "utf8");
  }
  throw new Error("README.md not found");
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

describe("README.md", () => {
  const md = loadReadme();

  test("contains the main title '타임투게더 NextJS'", () => {
    expect(md).toMatch(/^##\s*타임투게더\s+NextJS/m);
  });

  test("documents SVGR usage and constraints clearly", () => {
    expect(md).toMatch(/svgr\s*설치.*사용 중/i);
    expect(md).toMatch(/src\/assets\/svgs.*svgr.*컴포넌트처럼 사용/i);
    expect(md).toMatch(/그 외.*svg들은 URL 기반.*<Image>/i);
    expect(md).toMatch(/src\/svgr\.d\.ts.*next\.config\.ts/i);
    expect(md).toMatch(/svg이미지.*width.*height.*제거/i);
  });

  test("includes the folder structure section with 'SRC' and key top-level directories", () => {
    expect(md).toMatch(/###\s*폴\s*더\s*구조\s*9월\s*8일\s*기준/);
    const essentials = ["SRC", "app", "assets", "components", "hooks", "lib", "schemas", "types"];
    for (const key of essentials) {
      expect(md).toContain(key);
    }
  });

  test("lists important app routes and component files mentioned in the diff", () => {
    const mustContain = [
      "app/(auth)/login/page.tsx",
      "app/(auth)/register/page.tsx",
      "app/(dashboard)/calendar/page.tsx",
      "app/(dashboard)/groups/create/page.tsx",
      "app/(dashboard)/schedules/detail/When2Meet.tsx",
      "app/(dashboard)/schedules/detail/Where2Meet.tsx",
      "components/ui/button/Button.tsx",
      "components/ui/header/Header.tsx",
      "lib/utils.ts",
      "schemas/loginSchemas.ts",
      "schemas/scheduleSchemas.ts",
    ];
    for (const s of mustContain) {
      expect(md).toContain(s);
    }
  });

  test("does not contain obvious markdown issues: duplicate top-level headers", () => {
    const mainTitleCount = (md.match(/^##\s*타임투게더\s+NextJS\s*$/gm) || []).length;
    expect(mainTitleCount).toBeGreaterThanOrEqual(1);
  });

  test("uses fenced code blocks around the folder tree", () => {
    const fenceStart = md.indexOf("```");
    expect(fenceStart).toBeGreaterThanOrEqual(0);
    const afterStart = md.indexOf("SRC", fenceStart);
    const fenceEnd = md.indexOf("```", fenceStart + 3);
    expect(afterStart).toBeGreaterThanOrEqual(0);
    expect(fenceEnd).toBeGreaterThan(fenceStart);
    expect(afterStart).toBeLessThan(fenceEnd);
  });

  test("mentions Next.js specific guidance like Image usage", () => {
    expect(md).toMatch(/<Image>/);
  });
});