export type ChapterPackSource = { path: string; markdown: string };

export type GeneratedChapterPackRecord = {
  markdown: string;
  slug: string;
  sourcePath: string;
  subject: string;
  title: string;
};

const REQUIRED_FRONTMATTER_FIELDS = ['title', 'subject', 'chapter_slug'] as const;

export function buildChapterPackRecords(sources: ChapterPackSource[]): GeneratedChapterPackRecord[] {
  const records = sources.map((source) => {
    const frontmatter = parseFrontmatter(source.markdown);
    const title = readRequiredFrontmatterField(frontmatter, 'title', source.path);
    const subject = readRequiredFrontmatterField(frontmatter, 'subject', source.path);
    const slug = readRequiredFrontmatterField(frontmatter, 'chapter_slug', source.path);

    return {
      markdown: source.markdown,
      slug,
      sourcePath: source.path,
      subject,
      title,
    };
  });

  const sortedRecords = [...records].sort(compareRecordsBySlug);

  for (let index = 1; index < sortedRecords.length; index += 1) {
    const previousRecord = sortedRecords[index - 1];
    const currentRecord = sortedRecords[index];

    if (previousRecord?.slug === currentRecord?.slug) {
      throw new Error(
        `Duplicate chapter slug "${currentRecord.slug}" found in "${previousRecord.sourcePath}" and "${currentRecord.sourcePath}".`,
      );
    }
  }

  return sortedRecords;
}

export function renderChapterPacksModule(records: GeneratedChapterPackRecord[]): string {
  const sortedRecords = [...records].sort(compareRecordsBySlug);
  const chapterPacks = Object.fromEntries(
    sortedRecords.map((record) => [
      record.slug,
      {
        markdown: record.markdown,
        slug: record.slug,
        sourcePath: record.sourcePath,
        subject: record.subject,
        title: record.title,
      },
    ]),
  );

  return `export type ChapterPack = {
  markdown: string;
  slug: string;
  sourcePath: string;
  subject: string;
  title: string;
};

export const chapterPacks = ${JSON.stringify(chapterPacks, null, 2)} as const satisfies Record<string, ChapterPack>;
`;
}

function compareRecordsBySlug(left: GeneratedChapterPackRecord, right: GeneratedChapterPackRecord): number {
  if (left.slug < right.slug) {
    return -1;
  }

  if (left.slug > right.slug) {
    return 1;
  }

  if (left.sourcePath < right.sourcePath) {
    return -1;
  }

  if (left.sourcePath > right.sourcePath) {
    return 1;
  }

  return 0;
}

function parseFrontmatter(markdown: string): Map<string, string> {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const frontmatter = new Map<string, string>();

  if (!match) {
    return frontmatter;
  }

  const lines = match[1]?.split(/\r?\n/) ?? [];

  for (const line of lines) {
    const fieldMatch = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);

    if (!fieldMatch) {
      continue;
    }

    const [, key, rawValue = ''] = fieldMatch;
    frontmatter.set(key, stripWrappingQuotes(rawValue.trim()));
  }

  return frontmatter;
}

function readRequiredFrontmatterField(
  frontmatter: Map<string, string>,
  fieldName: (typeof REQUIRED_FRONTMATTER_FIELDS)[number],
  sourcePath: string,
): string {
  const value = frontmatter.get(fieldName)?.trim();

  if (!value) {
    throw new Error(`Chapter pack "${sourcePath}" is missing required frontmatter field "${fieldName}".`);
  }

  return value;
}

function stripWrappingQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
