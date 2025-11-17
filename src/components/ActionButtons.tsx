interface ActionButtonsProps {
  onScanFrame: () => void;
}

export function ActionButtons({ onScanFrame }: ActionButtonsProps) {
  return (
    <div className="section">
      <div className="section-title">Actions</div>
      <div className="action-buttons">
        <button className="button" onClick={onScanFrame}>
          Scan Frame for Invalid Terms
        </button>
      </div>
    </div>
  );
}
