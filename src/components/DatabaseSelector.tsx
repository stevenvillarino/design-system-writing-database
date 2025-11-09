import { Database } from '../types';

interface DatabaseSelectorProps {
  databases: Database[];
  currentDatabase: string;
  onChange: (database: string) => void;
}

export function DatabaseSelector({ databases, currentDatabase, onChange }: DatabaseSelectorProps) {
  return (
    <div className="section">
      <label htmlFor="database-select" className="section-title">
        Select Database
      </label>
      <select
        id="database-select"
        className="select"
        value={currentDatabase}
        onChange={(e) => onChange(e.target.value)}
      >
        {databases.map((db) => (
          <option key={db.id} value={db.id}>
            {db.displayName}
          </option>
        ))}
      </select>
    </div>
  );
}
