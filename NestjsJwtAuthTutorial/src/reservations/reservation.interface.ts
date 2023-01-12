export interface Reservation {
  id: string;
  from: Date;
  to: Date;
  room_id: string;
}

export interface QueryParams {
  room_id: string;
  before: string;
  after: string;
}
