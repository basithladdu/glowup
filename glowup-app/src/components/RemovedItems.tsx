import React from 'react';

interface RemovedItemsProps {
  /** What kind of thing was removed, e.g. "steps" / "habits" / "blocks". */
  noun: string;
  items: Array<{ id: string; label: string }>;
  onRestore: (id: string) => void;
}

/**
 * Shared "you removed these, tap to put them back" row.
 *
 * Removing a step, habit, or schedule block must never be a one-way door, and all
 * three opt-outs share the same store field — so they share this row too rather than
 * each carrying its own copy of the markup.
 */
export const RemovedItems: React.FC<RemovedItemsProps> = ({ noun, items, onRestore }) => {
  if (!items.length) return null;

  return (
    <div className="card">
      <p className="eyebrow"><span className="n">removed</span> {noun} you switched off</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {items.map((item) => (
          <button key={item.id} className="ai-chip" onClick={() => onRestore(item.id)}>
            + {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
