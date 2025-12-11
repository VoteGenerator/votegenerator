export enum PollType {
  RANKED = 'ranked',
  MULTIPLE = 'multiple',
  IMAGE = 'image',
  MEETING = 'meeting'
}

export interface PollOption {
  id: string;
  text: string;
  imageUrl?: string;
}

export interface PollSettings {
  hideResults: boolean;
  allowMultiple?: boolean;
}

export interface CreatePollRequest {
  title: string;
  description?: string;
  options: string[];
  pollType: PollType;
  settings: PollSettings;
}

export interface PollResponse {
  id: string;
  adminKey: string;
}

export interface PollData {
  id: string;
  title: string;
  description?: string;
  pollType: PollType;
  options: PollOption[];
  settings: PollSettings;
  createdAt: string;
  voteCount: number;
  isAdmin?: boolean;
}