export interface UserReservationData {
  actualBegin: string;
  awayBegin: string;
  awayEnd: string;
  begin: string;
  end: string;
  id: number;
  location: string;
  message: string;
  onDate: string;
  receipt: string;
  seatId: number;
  status: string;
  userEnded: boolean;
}

export class UserReservation implements UserReservationData {
  actualBegin: string;
  awayBegin: string;
  awayEnd: string;
  begin: string;
  end: string;
  id: number;
  location: string;
  message: string;
  onDate: string;
  receipt: string;
  seatId: number;
  status: string;
  userEnded: boolean;
  building: string;
  floor: number;
  room: string;
  constructor(reservation: UserReservationData) {
    for (const key in reservation) {
      if (reservation.hasOwnProperty(key)) {
        this[key] = reservation[key];
      }
    }
    var pieces = this.location.split(/[馆层区]/);
    this.building = pieces[0] + "馆";
    this.floor = parseInt(pieces[1]);
    this.room = pieces.length > 4 ? pieces[3] + "区" : pieces[2] + "区";
  }
}