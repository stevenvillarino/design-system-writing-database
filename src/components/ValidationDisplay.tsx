interface InvalidTerm {
  text: string;
  location: string;
}

interface ValidationDisplayProps {
  invalidTerms: InvalidTerm[];
}

export function ValidationDisplay({ invalidTerms }: ValidationDisplayProps) {
  if (invalidTerms.length === 0) {
    return null;
  }

  return (
    <div className="section">
      <div className="validation-section error">
        <div className="section-title">
          Invalid Terms Found ({invalidTerms.length})
        </div>
        <div className="invalid-terms-list">
          {invalidTerms.map((term, index) => (
            <div key={index} className="invalid-term">
              <div className="invalid-term-text">{term.text}</div>
              <div className="invalid-term-location">{term.location}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
