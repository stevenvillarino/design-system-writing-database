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

  // Group terms by type first, then by platform
  const termsByType = terms.reduce((acc, term) => {
    const types = term.types || [term.type || 'Other'];
    types.forEach(type => {
      if (!acc[type]) {
        acc[type] = {};
      }
      const platforms = term.platforms || [term.platform];
      platforms.forEach(platform => {
        if (!acc[type][platform]) {
          acc[type][platform] = [];
        }
        acc[type][platform].push(term);
      });
    });
    return acc;
  }, {} as Record<string, Record<string, Term[]>>);

  // Sort types and platforms alphabetically
  const sortedTypes = Object.keys(termsByType).sort();

  return (
    <div className="terms-list">
      {sortedTypes.map((type) => {
        const sortedPlatforms = Object.keys(termsByType[type]).sort();
        return (
          <div key={type} className="type-section">
            <div className="type-header">{type}</div>
            {sortedPlatforms.map((platform) => (
              <div key={`${type}-${platform}`} className="platform-subsection">
                <div className="platform-subheader">{platform}</div>
                {termsByType[type][platform].map((term, index) => (
                  <div
                    key={`${term.term}-${index}`}
                    className="term-item"
                    onClick={() => onTermClick(term.term)}
                  >
                    <div className="term-header">
                      <div className="term-name">{term.term}</div>
                      {term.platforms && term.platforms.length > 1 && (
                        <div className="platform-tags">
                          {term.platforms.map(p => (
                            <span key={p} className="platform-tag">{p}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {term.explanation && (
                      <div className="term-explanation">{term.explanation}</div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
