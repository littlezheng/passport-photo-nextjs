export interface BusinessLocation {
  name: string; // Location name, e.g., "Downtown Location"
  address: string; // Full address as a string
  phone?: string;
  email?: string;
  hours: Record<string, string>; // Opening hours for each day (e.g., "Mon-Fri": "9:00 AM - 7:00 PM")
}
