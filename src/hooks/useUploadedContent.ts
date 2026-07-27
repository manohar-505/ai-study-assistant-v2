const STORAGE_KEY = 'studymind_content';

export const saveUploadedContent = (content: string, filename: string): void => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ content, filename, timestamp: Date.now() }));
};

export const getUploadedContent = (): { content: string; filename: string } | null => {
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return null;

  try {
    const parsed = JSON.parse(stored);
    return { content: parsed.content, filename: parsed.filename };
  } catch {
    return null;
  }
};

export const clearUploadedContent = (): void => {
  sessionStorage.removeItem(STORAGE_KEY);
};
