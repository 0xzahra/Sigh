export enum AppMode {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  REVIEW = 'REVIEW',
  TELEPROMPTER = 'TELEPROMPTER',
  LOCKED = 'LOCKED' // The Shakedown
}

export interface Citation {
  url: string;
  title: string;
  snippet?: string;
}

export interface GeneratedContent {
  rawText: string;
  formattedText: string; // With Bionic Reading (Markdown)
  citations: Citation[];
  directorNotes: string[];
}

export interface EditorState {
  fogLevel: number; // 0 to 100
  inputTranscript: string;
  output: GeneratedContent | null;
  mode: AppMode;
  editorMessage: string; // The "Persona" snark
}
