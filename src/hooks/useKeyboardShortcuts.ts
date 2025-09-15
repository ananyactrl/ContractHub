import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  description: string;
}

export const useKeyboardShortcuts = (shortcuts: KeyboardShortcut[]) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    shortcuts.forEach(({ key, ctrlKey, shiftKey, altKey, callback }) => {
      if (
        event.key.toLowerCase() === key.toLowerCase() &&
        !!event.ctrlKey === !!ctrlKey &&
        !!event.shiftKey === !!shiftKey &&
        !!event.altKey === !!altKey
      ) {
        event.preventDefault();
        callback();
      }
    });
  }, [shortcuts]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
};

// Common shortcuts for the dashboard
export const useDashboardShortcuts = (
  onSearch: () => void,
  onUpload: () => void,
  onClearFilters: () => void,
  onToggleFilters: () => void
) => {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '/',
      callback: onSearch,
      description: 'Focus search',
    },
    {
      key: 'u',
      ctrlKey: true,
      callback: onUpload,
      description: 'Open upload modal',
    },
    {
      key: 'f',
      ctrlKey: true,
      callback: onToggleFilters,
      description: 'Toggle filters',
    },
    {
      key: 'Escape',
      callback: onClearFilters,
      description: 'Clear filters',
    },
  ];

  useKeyboardShortcuts(shortcuts);
};
