import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { EmptyState } from "@/components/common/EmptyState";
import { Accordion } from "@/components/common/Accordion";
import { SearchInput } from "@/components/common/SearchInput";
import { Tabs } from "@/components/common/Tabs";
import { Modal } from "@/components/common/Modal";
import { Badge } from "@/components/common/Badge";
import { ProgressBar } from "@/components/common/ProgressBar";
import { CodeBlock } from "@/components/code/CodeBlock";
import { MemoryRouter } from "react-router-dom";

describe("Core UI Components Interaction & Layout", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("EmptyState", () => {
    it("renders title, description, and handles action button click", () => {
      const handleAction = vi.fn();
      render(
        <EmptyState
          icon="🔍"
          title="No results found"
          description="Try adjusting your filters"
          actionLabel="Reset Filters"
          onAction={handleAction}
        />,
      );

      expect(screen.getByText("No results found")).toBeInTheDocument();
      expect(screen.getByText("Try adjusting your filters")).toBeInTheDocument();

      const button = screen.getByRole("button", { name: "Reset Filters" });
      fireEvent.click(button);
      expect(handleAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("SearchInput", () => {
    it("renders input, updates text and triggers clear button", () => {
      const handleChange = vi.fn();
      render(
        <SearchInput
          value="debounce"
          onChange={handleChange}
          placeholder="Search items..."
          debounceMs={100}
        />,
      );

      const input = screen.getByPlaceholderText("Search items...");
      expect(input).toHaveValue("debounce");

      fireEvent.change(input, { target: { value: "curry" } });
      act(() => {
        vi.advanceTimersByTime(150);
      });
      expect(handleChange).toHaveBeenCalledWith("curry");

      const clearBtn = screen.getByLabelText("Clear search");
      fireEvent.click(clearBtn);
      expect(handleChange).toHaveBeenCalledWith("");
    });
  });

  describe("Accordion", () => {
    it("toggles aria-expanded on header click", () => {
      const items = [
        {
          id: "closure",
          title: "What is closure?",
          content: <p>A closure gives you access to an outer function scope.</p>,
        },
      ];

      render(<Accordion items={items} />);

      const trigger = screen.getByRole("button", { name: /What is closure\?/i });
      expect(trigger).toHaveAttribute("aria-expanded", "false");

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");

      fireEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });
  });

  describe("Tabs", () => {
    it("renders tab items and handles tab switching to display content", () => {
      const tabs = [
        { id: "description", label: "Description", content: <div>Description Content</div> },
        { id: "editorial", label: "Editorial", content: <div>Editorial Content</div> },
        { id: "solutions", label: "Solutions", content: <div>Solutions Content</div> },
      ];

      render(<Tabs tabs={tabs} defaultTab="description" />);

      expect(screen.getByText("Description Content")).toBeInTheDocument();
      expect(screen.queryByText("Editorial Content")).not.toBeInTheDocument();

      const editorialTab = screen.getByRole("tab", { name: "Editorial" });
      fireEvent.click(editorialTab);

      expect(screen.getByText("Editorial Content")).toBeInTheDocument();
      expect(screen.queryByText("Description Content")).not.toBeInTheDocument();
    });
  });

  describe("Modal", () => {
    it("renders open modal and handles close button click after animation", () => {
      const handleClose = vi.fn();
      render(
        <Modal isOpen={true} onClose={handleClose} title="Templates Modal">
          <div>Modal Body Content</div>
        </Modal>,
      );

      expect(screen.getByText("Templates Modal")).toBeInTheDocument();
      expect(screen.getByText("Modal Body Content")).toBeInTheDocument();

      const closeButton = screen.getByLabelText("Close dialog");
      fireEvent.click(closeButton);

      act(() => {
        vi.advanceTimersByTime(250);
      });

      expect(handleClose).toHaveBeenCalledTimes(1);
    });

    it("does not render when isOpen is false", () => {
      render(
        <Modal isOpen={false} onClose={() => {}} title="Closed Modal">
          <div>Hidden Content</div>
        </Modal>,
      );

      expect(screen.queryByText("Closed Modal")).not.toBeInTheDocument();
    });
  });

  describe("Badge & ProgressBar", () => {
    it("renders badges with proper text content", () => {
      render(<Badge variant="beginner">Easy</Badge>);
      expect(screen.getByText("Easy")).toBeInTheDocument();
    });

    it("renders progress bar with accurate percentage attribute", () => {
      render(<ProgressBar value={75} label="Progress" />);
      const progress = screen.getByRole("progressbar");
      expect(progress).toHaveAttribute("aria-valuenow", "75");
    });
  });

  describe("CodeBlock In-Place Live Preview", () => {
    it("toggles between Code view and Live Preview in-place", () => {
      const htmlCode = `<div class="switch">Switch component</div>\n<style>.switch { color: red; }</style>`;
      render(
        <MemoryRouter>
          <CodeBlock code={htmlCode} language="html" />
        </MemoryRouter>,
      );

      const previewBtn = screen.getByRole("button", { name: /Live HTML\/CSS Preview/i });
      expect(previewBtn).toHaveTextContent("👁️ Live Preview");

      // Click to toggle preview ON
      fireEvent.click(previewBtn);
      expect(screen.getByRole("button", { name: /Show Code/i })).toBeInTheDocument();
      expect(screen.getByTitle("Live Component Preview")).toBeInTheDocument();

      // Click to toggle preview OFF
      const showCodeBtn = screen.getByRole("button", { name: /Show Code/i });
      fireEvent.click(showCodeBtn);
      expect(screen.queryByTitle("Live Component Preview")).not.toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Live HTML\/CSS Preview/i })).toHaveTextContent("👁️ Live Preview");
    });

    it("renders Live Component Preview for React TSX components instead of broken run button", () => {
      const tsxCode = `import React from 'react';\nexport default function Modal() { return <div>Modal</div>; }`;
      render(
        <MemoryRouter>
          <CodeBlock code={tsxCode} language="tsx" />
        </MemoryRouter>,
      );

      expect(screen.queryByRole("button", { name: /Run code in place/i })).not.toBeInTheDocument();
      const previewBtn = screen.getByRole("button", { name: /Live Component Preview/i });
      expect(previewBtn).toHaveTextContent("👁️ Live Preview");

      fireEvent.click(previewBtn);
      expect(screen.getByTitle("Live Component Preview")).toBeInTheDocument();
    });
  });
});
