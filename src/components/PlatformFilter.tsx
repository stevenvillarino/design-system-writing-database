interface PlatformFilterProps {
  platforms: string[];
  currentPlatform: string;
  onChange: (platform: string) => void;
}

export function PlatformFilter({ platforms, currentPlatform, onChange }: PlatformFilterProps) {
  const allPlatforms = ['All Platforms', ...platforms];

  return (
    <div className="section">
      <div className="section-title">Filter by Platform</div>
      <div className="platform-grid">
        {allPlatforms.map((platform) => (
          <button
            key={platform}
            className={`badge ${currentPlatform === platform ? 'active' : ''}`}
            onClick={() => onChange(platform)}
          >
            {platform}
          </button>
        ))}
      </div>
    </div>
  );
}
