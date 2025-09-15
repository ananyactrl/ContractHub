import React from 'react';

export type QuickAction = { id: string; icon?: React.ReactNode; label: string; hotkey?: string; onClick: () => void };
export type QuickActionsProps = { actions: QuickAction[]; title?: string };

const QuickActions: React.FC<QuickActionsProps> = ({ actions, title = 'Quick Actions' }) => {
  return (
    <section className="bg-surface rounded-xl shadow-card hover:shadow-card-hover transition-shadow p-4 border border-border" aria-label={title}>
      <h3 className="text-sm font-semibold text-text-strong mb-3">{title}</h3>
      <ul className="space-y-2">
        {actions.map(action => (
          <li key={action.id}>
            <button
              type="button"
              onClick={action.onClick}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-600"
              aria-label={action.label}
            >
              <span className="flex items-center gap-2 text-sm text-text-strong">
                {action.icon}
                {action.label}
              </span>
              {action.hotkey && (
                <kbd className="text-xs text-text-muted border border-border px-1.5 py-0.5 rounded">{action.hotkey}</kbd>
              )}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default QuickActions;


