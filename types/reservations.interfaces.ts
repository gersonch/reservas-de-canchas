export interface Reservation {
  _id: string;
  fieldId: string;
  userId: string;
  complexId: string;
  startTime: string; // "2025-08-05T10:00"
  duration: string;
  price: number;
  createdAt: string;
  __v?: number;
}
export interface Availability {
  dayOfWeek: number;
  from: string;
  to: string;
  prices?: any[];
}
export interface Field {
  _id: string;
  name: string;
  type: string;
  complexId: string;
  availability: Availability[];
  __v?: number;
}
export interface FieldsListProps {
  fields: Field[];
  reservations?: Reservation[]; // Agregar reservations como prop opcional
}
