/**
 * Utility functions for normalizing, dedenting, and sanitizing blog post content.
 * Prevents CommonMark from mistakenly interpreting indented lines (4+ spaces)
 * as preformatted code blocks (<pre><code>).
 */

export function normalizeArticleContent(content?: string): string {
  if (!content || typeof content !== "string") return "";

  const lines = content.split("\n");
  let inFencedBlock = false;

  const processed = lines.map(line => {
    const trimmed = line.trim();

    // Preserve fenced code blocks exactly as written
    if (trimmed.startsWith("```")) {
      inFencedBlock = !inFencedBlock;
      return line;
    }
    if (inFencedBlock) {
      return line;
    }

    // Preserve empty lines
    if (!trimmed) {
      return "";
    }

    // If line begins with HTML tags, markdown headings, lists, or blockquotes, place at col 0
    if (/^<[a-zA-Z\/!]/.test(trimmed) || /^(#{1,6}|[-*+]|\d+\.|>)\s/.test(trimmed)) {
      return trimmed;
    }

    // For any other prose line with leading spaces (e.g. from template string indentation),
    // strip the indentation so CommonMark will not treat it as an indented code block
    return line.replace(/^[ \t]+/, "");
  });

  return processed.join("\n").trim();
}

/**
 * Calculates estimated reading time in minutes based on 225 WPM standard
 */
export function calculateReadingTime(content?: string): string {
  if (!content) return "3 min read";
  const clean = content
    .replace(/<[^>]+>/g, " ")
    .replace(/[`#*_~\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const words = clean.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(words / 225);
  return `${Math.max(2, minutes)} min read`;
}
