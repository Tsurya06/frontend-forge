import { useState, useCallback } from "react";
import styles from "./Accordion.module.css";

interface AccordionItem {
  readonly id: string;
  readonly title: string;
  readonly content: React.ReactNode;
}

interface AccordionProps {
  readonly items: readonly AccordionItem[] | AccordionItem[];
  readonly multiple?: boolean;
  readonly className?: string;
}

export function Accordion({
  items,
  multiple = false,
  className,
}: Readonly<AccordionProps>) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        const next = new Set(multiple ? prev : []);
        if (prev.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [multiple],
  );

  return (
    <div className={`${styles.accordion} ${className ?? ""}`}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        return (
          <div key={item.id} className={styles.item}>
            <button
              type="button"
              className={styles.trigger}
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.id}`}
              id={`accordion-trigger-${item.id}`}
            >
              <span>{item.title}</span>
              <span
                className={`${styles.chevron} ${isOpen ? styles.open : ""}`}
                aria-hidden="true"
              >
                {"\u25BC"}
              </span>
            </button>
            <div
              className={`${styles.contentWrapper} ${isOpen ? styles.open : ""}`}
              role="region"
              id={`accordion-content-${item.id}`}
              aria-labelledby={`accordion-trigger-${item.id}`}
            >
              <div className={styles.contentInner}>
                <div className={styles.content}>{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
