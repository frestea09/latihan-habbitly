import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { TimeRange } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDatesInRange(timeRange: TimeRange): string[] {
    const today = new Date();
    const dates: string[] = [];
    
    switch (timeRange) {
        case 'weekly': {
            for (let i = 0; i < 7; i++) {
                const date = new Date();
                date.setDate(today.getDate() - i);
                dates.push(date.toISOString().split('T')[0]);
            }
            break;
        }
        case 'monthly': {
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const daysInMonth = (today.getTime() - firstDayOfMonth.getTime()) / (1000 * 3600 * 24) + 1;
            for (let i = 0; i < daysInMonth; i++) {
                const date = new Date(firstDayOfMonth);
                date.setDate(firstDayOfMonth.getDate() + i);
                dates.push(date.toISOString().split('T')[0]);
            }
            break;
        }
        case 'yearly': {
            const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
            // iterate from first day of year to today
             for (let d = new Date(firstDayOfYear); d <= today; d.setDate(d.getDate() + 1)) {
                dates.push(new Date(d).toISOString().split('T')[0]);
            }
            break;
        }
    }
    return dates.sort((a,b) => a.localeCompare(b));
}
