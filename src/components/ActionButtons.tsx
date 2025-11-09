interface ActionButtonsProps {
  onScanFrame: () => void;
  onGenerateMocks: () => void;
}

export function ActionButtons({ onScanFrame, onGenerateMocks }: ActionButtonsProps) {
  return (
    <div className="section">
      <div className="section-title">Actions</div>
      <div className="action-buttons">
        <button className="button" onClick={onScanFrame}>
          Scan Frame for Invalid Terms
        </button>
        <button className="button button-secondary" onClick={onGenerateMocks}>
          Generate Mocks from Template
        </button>
      </div>
    </div>
  );
}
