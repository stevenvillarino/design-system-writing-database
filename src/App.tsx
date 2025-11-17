import { useEffect, useState } from 'react';
import { PlatformFilter } from './components/PlatformFilter';
import { ActionButtons } from './components/ActionButtons';
import { TermsList } from './components/TermsList';
import { ValidationDisplay } from './components/ValidationDisplay';
import { SearchInput } from './components/SearchInput';
import { Term, MessageType, UIMessageType } from './types';
import './App.css';

function App() {
  const [currentPlatform, setCurrentPlatform] = useState('All Platforms');
  const [terms, setTerms] = useState<Term[]>([]);
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [invalidTerms, setInvalidTerms] = useState<Array<{ text: string; location: string; nodeId: string }>>([]);
  const [searchQuery, setSearchQuery] = useState('');

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

    // Initial load - request terms
    sendMessage({ type: 'platform-changed', platform: '' });
  }, []);

  const sendMessage = (message: UIMessageType) => {
    parent.postMessage({ pluginMessage: message }, '*');
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

  const handleSelectNode = (nodeId: string) => {
    console.log('Sending select-node message with nodeId:', nodeId);
    sendMessage({ type: 'select-node', nodeId });
  };

  const handleClearValidation = () => {
    setInvalidTerms([]);
  };

  // Filter terms based on search query
  const filteredTerms = terms.filter(term => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      term.term?.toLowerCase().includes(query) ||
      term.explanation?.toLowerCase().includes(query) ||
      term.type?.toLowerCase().includes(query) ||
      term.platform?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="app">
      <PlatformFilter
        platforms={platforms}
        currentPlatform={currentPlatform}
        onChange={handlePlatformChange}
      />
      <SearchInput value={searchQuery} onChange={setSearchQuery} />
      <ActionButtons onScanFrame={handleScanFrame} />
      {invalidTerms.length > 0 && (
        <ValidationDisplay
          invalidTerms={invalidTerms}
          onSelectNode={handleSelectNode}
          onClear={handleClearValidation}
        />
      )}
      <TermsList terms={filteredTerms} onTermClick={handleTermClick} />
    </div>
  );
}

export default App;
