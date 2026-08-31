import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { useNotes } from '@/hooks/useNotes';

type NotesContextValue = ReturnType<typeof useNotes>;

const NotesContext = createContext<NotesContextValue | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const notes = useNotes();
  return (
    <NotesContext.Provider value={notes}>{children}</NotesContext.Provider>
  );
}

export function useNotesContext(): NotesContextValue {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error('useNotesContext must be used within a NotesProvider');
  }
  return ctx;
}
