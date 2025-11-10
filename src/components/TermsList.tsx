import { Term } from '../types';

interface TermsListProps {
  terms: Term[];
  onTermClick: (term: string) => void;
}

export function TermsList({ terms, onTermClick }: TermsListProps) {
  if (terms.length === 0) {
    return (
      <div className="empty-state">
        No terms available. Select a database and platform to view approved terms.
      </div>
    );
  }

  return (
    <div className="terms-list">
      {terms.map((term, index) => (
        <div
          key={`${term.term}-${index}`}
          className="term-item"
          onClick={() => onTermClick(term.term)}
        >
          <div className="term-name">{term.term}</div>
          {term.explanation && (
            <div className="term-explanation">{term.explanation}</div>
          )}
        </div>
      ))}
    </div>
  );
}
