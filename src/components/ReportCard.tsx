import React from 'react';

export type ReportCardProps = {
  title: string;
  thumbnailUrl?: string;
  schedule: string;
  nextRunAt?: string;
  onOpen?: () => void;
};

const ReportCard: React.FC<ReportCardProps> = ({ title, thumbnailUrl, schedule, nextRunAt, onOpen }) => {
  return (
    <article className="bg-surface rounded-xl shadow-card hover:shadow-card-hover transition-shadow border border-border overflow-hidden" aria-label={title}>
      <div className="aspect-video bg-gray-100">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt="Report preview" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted text-sm">No preview</div>
        )}
      </div>
      <div className="p-4 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-text-strong">{title}</h4>
          <p className="text-xs text-text-muted">{schedule}{nextRunAt ? ` • Next: ${nextRunAt}` : ''}</p>
        </div>
        <button
          type="button"
          onClick={onOpen}
          className="text-sm font-medium px-3 py-1.5 rounded-lg bg-brand-600 text-white hover:bg-brand-500"
        >
          Open
        </button>
      </div>
    </article>
  );
};

export default ReportCard;


