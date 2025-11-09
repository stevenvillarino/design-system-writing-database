export interface Term {
  term: string;
  platform: string;
  explanation: string;
}

export interface Database {
  id: string;
  displayName: string;
}

export type MessageType =
  | { type: 'update-terms'; terms: Term[] }
  | { type: 'update-platforms'; platforms: string[] }
  | { type: 'invalid-terms-found'; terms: Array<{ text: string; location: string }> }
  | { type: 'validation-result'; isValid: boolean; text: string }
  | { type: 'error'; message: string };

export type UIMessageType =
  | { type: 'database-changed'; database: string }
  | { type: 'platform-changed'; platform: string }
  | { type: 'create-text'; text: string }
  | { type: 'scan-frame' }
  | { type: 'create-mocks' };
