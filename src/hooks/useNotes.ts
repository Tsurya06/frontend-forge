import { useCallback } from "react";
import { useLocalStorage } from "./useLocalStorage";

const NOTES_KEY = "feeq-notes";

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Record<string, string>>(
    NOTES_KEY,
    {},
  );

  const getNote = useCallback((id: string): string => notes[id] ?? "", [notes]);

  const setNote = useCallback(
    (id: string, text: string) => {
      setNotes((prev) => ({ ...prev, [id]: text }));
    },
    [setNotes],
  );

  const deleteNote = useCallback(
    (id: string) => {
      setNotes((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
    },
    [setNotes],
  );

  const getAllNotes = useCallback(() => notes, [notes]);

  return { notes, getNote, setNote, deleteNote, getAllNotes };
}
