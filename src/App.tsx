import { useEffect, useState } from 'react';
import { DatabaseSelector } from './components/DatabaseSelector';
import { PlatformFilter } from './components/PlatformFilter';
import { ActionButtons } from './components/ActionButtons';
import { TermsList } from './components/TermsList';
import { ValidationDisplay } from './components/ValidationDisplay';
import { Term, Database, MessageType, UIMessageType } from './types';
import './App.css';

const DATABASES: Database[] = [
  { id: 'commonTerms', displayName: 'UX Writing Database' },
  { id: 'sportsOnly', displayName: 'Zone Tiles - Sports' },
];

function App() {
  const [currentDatabase, setCurrentDatabase] = useState('commonTerms');
  const [currentPlatform, setCurrentPlatform] = useState('All Platforms');
  const [terms, setTerms] = useState<Term[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [invalidTerms, setInvalidTerms] = useState<Array<{ text: string; location: string }>>([]);

  useEffect(() => {
    // Listen for messages from plugin code
    window.onmessage = (event: MessageEvent) => {
      const message = event.data.pluginMessage as MessageType;

      if (!message) return;

      switch (message.type) {
        case 'update-terms':
          setTerms(message.terms);
          break;
        case 'update-platforms':
          setPlatforms(message.platforms);
          break;
        case 'invalid-terms-found':
          setInvalidTerms(message.terms);
          break;
        case 'validation-result':
          // Handle validation result if needed
          break;
        case 'error':
          console.error('Plugin error:', message.message);
          break;
      }
    };

    // Initial load
    sendMessage({ type: 'database-changed', database: currentDatabase });
  }, []);

  const sendMessage = (message: UIMessageType) => {
    parent.postMessage({ pluginMessage: message }, '*');
  };

  const handleDatabaseChange = (database: string) => {
    setCurrentDatabase(database);
    sendMessage({ type: 'database-changed', database });
  };

  const handlePlatformChange = (platform: string) => {
    setCurrentPlatform(platform);
    sendMessage({ type: 'platform-changed', platform });
  };

  const handleTermClick = (text: string) => {
    sendMessage({ type: 'create-text', text });
  };

  const handleScanFrame = () => {
    setInvalidTerms([]);
    sendMessage({ type: 'scan-frame' });
  };

  const handleGenerateMocks = () => {
    sendMessage({ type: 'create-mocks' });
  };

  return (
    <div className="app">
      <DatabaseSelector
        databases={DATABASES}
        currentDatabase={currentDatabase}
        onChange={handleDatabaseChange}
      />
      <PlatformFilter
        platforms={platforms}
        currentPlatform={currentPlatform}
        onChange={handlePlatformChange}
      />
      <ActionButtons
        onScanFrame={handleScanFrame}
        onGenerateMocks={handleGenerateMocks}
      />
      {invalidTerms.length > 0 && <ValidationDisplay invalidTerms={invalidTerms} />}
      <TermsList terms={terms} onTermClick={handleTermClick} />
    </div>
  );
}

export default App;
