import { CreatePollRequest, PollResponse, PollData } from '../types';

const API_BASE = '/.netlify/functions';

export const createPoll = async (data: CreatePollRequest): Promise<PollResponse> => {
  const response = await fetch(`${API_BASE}/create-poll`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create poll');
  }

  return response.json();
};

export const getPoll = async (id: string, adminKey?: string): Promise<PollData> => {
  const params = new URLSearchParams();
  params.append('id', id);
  if (adminKey) params.append('admin', adminKey);

  const response = await fetch(`${API_BASE}/get-poll?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch poll');
  }

  return response.json();
};