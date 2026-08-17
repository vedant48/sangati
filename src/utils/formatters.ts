// String and Date formatters for UI presentation

import { RideType } from '../types';

export function formatDateTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return isoString;
  }
}

export function formatTimeOnly(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-IN', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    return isoString;
  }
}

export function formatDateOnly(isoString: string): string {
  try {
    const date = new Date(isoString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }

    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    });
  } catch (e) {
    return isoString;
  }
}

export function formatCurrency(amount: number): string {
  if (!amount || amount === 0) return 'Free';
  return `₹${Math.round(amount)}`;
}

export function getRideTypeLabel(type: RideType): string {
  switch (type) {
    case 'free':
      return 'Free Ride';
    case 'fuel_sharing':
      return 'Fuel Sharing';
    case 'cab_sharing':
      return 'Cab Sharing';
    default:
      return 'Carpool';
  }
}
