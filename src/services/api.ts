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

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to create poll');
    }
    return result;
  } else {
    // Handle non-JSON response (likely a 404 or 500 HTML page from Netlify)
    const text = await response.text();
    console.error('API Error (Non-JSON):', text);
    throw new Error(`Server error: ${response.status} ${response.statusText}. Check your netlify.toml and function logs.`);
  }
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

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch poll');
    }
    return result;
  } else {
    const text = await response.text();
    console.error('API Error (Non-JSON):', text);
    throw new Error(`Server error: ${response.status} ${response.statusText}. Check your netlify.toml and function logs.`);
  }
};