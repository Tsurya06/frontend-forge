import React from "react";
import { CodeBlock } from "@/components/code/CodeBlock";
import styles from "./AiTutorDrawer.module.css";

interface AiMarkdownProps {
  content: string;
}

export function AiMarkdown({ content }: AiMarkdownProps) {
  // Split content by code fences: ```[lang]\n[code]\n```
  const parts = React.useMemo(() => {
    const regex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const segments: Array<{ type: "text" | "code"; content: string; language?: string }> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({
          type: "text",
          content: content.slice(lastIndex, match.index),
        });
      }
      segments.push({
        type: "code",
        language: match[1] || "typescript",
        content: match[2]?.trim() || "",
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      segments.push({
        type: "text",
        content: content.slice(lastIndex),
      });
    }

    return segments;
  }, [content]);

  return (
    <div className={styles.markdownBody}>
      {parts.map((seg, idx) => {
        if (seg.type === "code") {
          return (
            <div key={idx} className={styles.codeBlockWrapper}>
              <CodeBlock
                code={seg.content}
                language={seg.language || "typescript"}
                showLineNumbers
              />
            </div>
          );
        }

        // Render text with paragraphs, bullet points, bold, and inline code
        const paragraphs = seg.content.split("\n\n");
        return (
          <React.Fragment key={idx}>
            {paragraphs.map((para, pIdx) => {
              const trimmed = para.trim();
              if (!trimmed) return null;

              // Bullet lists
              if (trimmed.startsWith("• ") || trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                const items = trimmed.split("\n").map((line) => line.replace(/^[-•*]\s*/, ""));
                return (
                  <ul key={pIdx} className={styles.mdList}>
                    {items.map((item, iIdx) => (
                      <li key={iIdx}>{renderFormattedInline(item)}</li>
                    ))}
                  </ul>
                );
              }

              // Numbered lists
              if (/^\d+\.\s/.test(trimmed)) {
                const items = trimmed.split("\n").map((line) => line.replace(/^\d+\.\s*/, ""));
                return (
                  <ol key={pIdx} className={styles.mdOrderedList}>
                    {items.map((item, iIdx) => (
                      <li key={iIdx}>{renderFormattedInline(item)}</li>
                    ))}
                  </ol>
                );
              }

              return (
                <p key={pIdx} className={styles.mdParagraph}>
                  {renderFormattedInline(trimmed)}
                </p>
              );
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function renderFormattedInline(text: string): React.ReactNode {
  // Tokenize by inline code `...` and bold **...**
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return tokens.map((tok, i) => {
    if (tok.startsWith("`") && tok.endsWith("`")) {
      return (
        <code key={i} className={styles.mdInlineCode}>
          {tok.slice(1, -1)}
        </code>
      );
    }
    if (tok.startsWith("**") && tok.endsWith("**")) {
      return <strong key={i}>{tok.slice(2, -2)}</strong>;
    }
    return tok;
  });
}
