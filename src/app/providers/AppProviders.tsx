import type { ReactNode } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { ProgressProvider } from "@/context/ProgressContext";
import { BookmarkProvider } from "@/context/BookmarkContext";
import { NotesProvider } from "@/context/NotesContext";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <ProgressProvider>
        <BookmarkProvider>
          <NotesProvider>{children}</NotesProvider>
        </BookmarkProvider>
      </ProgressProvider>
    </ThemeProvider>
  );
}
