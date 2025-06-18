interface UsageData {
  totalCalls: number;
  todayCalls: number;
  thisWeekCalls: number;
  thisMonthCalls: number;
  dailyUsage: { date: string; calls: number }[];
}

class UsageService {
  private getStorageKey = () => 'auralis_usage_data';

  getUsageData(): UsageData {
    const stored = localStorage.getItem(this.getStorageKey());
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default data with some sample usage
    return {
      totalCalls: 147,
      todayCalls: 12,
      thisWeekCalls: 45,
      thisMonthCalls: 147,
      dailyUsage: [
        { date: '2024-06-12', calls: 8 },
        { date: '2024-06-13', calls: 15 },
        { date: '2024-06-14', calls: 12 },
        { date: '2024-06-15', calls: 20 },
        { date: '2024-06-16', calls: 18 },
        { date: '2024-06-17', calls: 10 },
        { date: '2024-06-18', calls: 12 },
      ]
    };
  }

  incrementUsage(): void {
    const data = this.getUsageData();
    const today = new Date().toISOString().split('T')[0];
    
    data.totalCalls++;
    data.todayCalls++;
    data.thisWeekCalls++;
    data.thisMonthCalls++;
    
    // Update daily usage
    const todayEntry = data.dailyUsage.find(entry => entry.date === today);
    if (todayEntry) {
      todayEntry.calls++;
    } else {
      data.dailyUsage.push({ date: today, calls: 1 });
      // Keep only last 7 days
      data.dailyUsage = data.dailyUsage.slice(-7);
    }
    
    localStorage.setItem(this.getStorageKey(), JSON.stringify(data));
  }
}

export const usageService = new UsageService();
