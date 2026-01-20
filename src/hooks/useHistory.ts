import { useState, useCallback } from 'react';

export const useHistory = <T>(initialState: T) => {
  const [history, setHistory] = useState<{
    past: T[];
    present: T;
    future: T[];
  }>({
    past: [],
    present: initialState,
    future: [],
  });

  const undo = useCallback(() => {
    setHistory(prev => {
      if (prev.past.length === 0) return prev;
      
      const newPresent = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, -1);
      
      return {
        past: newPast,
        present: newPresent,
        future: [prev.present, ...prev.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(prev => {
      if (prev.future.length === 0) return prev;
      
      const newPresent = prev.future[0];
      const newFuture = prev.future.slice(1);
      
      return {
        past: [...prev.past, prev.present],
        present: newPresent,
        future: newFuture,
      };
    });
  }, []);

  const update = useCallback((newPresent: T) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: newPresent,
      future: [],
    }));
  }, []);

  return {
    state: history.present,
    undo,
    redo,
    update,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
  };
};