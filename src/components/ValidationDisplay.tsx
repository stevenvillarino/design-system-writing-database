interface InvalidTerm {
  text: string;
  location: string;
  nodeId: string;
}

interface ValidationDisplayProps {
  invalidTerms: InvalidTerm[];
  onSelectNode: (nodeId: string) => void;
  onClear: () => void;
}

export function ValidationDisplay({ invalidTerms, onSelectNode, onClear }: ValidationDisplayProps) {
  if (invalidTerms.length === 0) {
    return null;
  }

  return (
    <div className="section">
      <div className="validation-section error">
        <div className="validation-header">
          <div className="section-title">
            Invalid Terms Found ({invalidTerms.length})
          </div>
          <button className="button-clear" onClick={onClear}>
            Clear
          </button>
        </div>
        <div className="invalid-terms-list">
          {invalidTerms.map((term, index) => (
            <div key={index} className="invalid-term">
              <div className="invalid-term-content">
                <div>
                  <div className="invalid-term-text">"{term.text}"</div>
                  <div className="invalid-term-location">in {term.location}</div>
                </div>
                <button
                  className="button-link"
                  onClick={() => onSelectNode(term.nodeId)}
                >
                  Go to layer
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
