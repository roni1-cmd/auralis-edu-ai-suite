
export interface HistoryItem {
  id: string;
  content: string;
  timestamp: Date;
  feature: string;
  input: string;
}

export const saveToHistory = (item: Omit<HistoryItem, 'id'>) => {
  const historyItem: HistoryItem = {
    ...item,
    id: Date.now().toString(),
  };

  const existingHistory = getHistory();
  const updatedHistory = [historyItem, ...existingHistory];
  
  localStorage.setItem('auralis_history', JSON.stringify(updatedHistory));
};

export const getHistory = (): HistoryItem[] => {
  try {
    const history = localStorage.getItem('auralis_history');
    if (history) {
      const parsed = JSON.parse(history);
      return parsed.map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
    }
  } catch (error) {
    console.error('Error loading history:', error);
  }
  return [];
};

export const deleteHistoryItem = (id: string) => {
  const history = getHistory();
  const updatedHistory = history.filter(item => item.id !== id);
  localStorage.setItem('auralis_history', JSON.stringify(updatedHistory));
};

export const clearHistory = () => {
  localStorage.removeItem('auralis_history');
};
