export interface BuildingFilterData {
  buildings: (number | string)[][];
  rooms: (number | string)[][];
  hours: number;
  dates: string[];
}

/**
 * 场馆
 */
export class LibraryBuilding {
  buildingID: number;
  buildingName: string;
  buildingRooms: Array<LibraryRoom>;
  constructor(parameters: Array<any>) {
    this.buildingID = parameters[0];
    this.buildingName = parameters[1];
    this.buildingRooms = new Array<LibraryRoom>();
  }
}

/**
 * 房间数据接口
 */
export interface LibraryRoomData {
  roomId: number;
  room: string;
  floor: number;
  reserved: number;
  inUse: number;
  away: number;
  totalSeats: number;
  free: number;
}

/**
 * 房间
 */
export class LibraryRoom implements LibraryRoomData {
  roomId: number;
  room: string;
  floor: number;
  reserved: number;
  inUse: number;
  away: number;
  totalSeats: number;
  free: number;
  roomSeats: Array<LibrarySeat>;
  constructor(parameters: LibraryRoomData) {
    for (const key in parameters) {
      if (parameters.hasOwnProperty(key)) {
        this[key] = parameters[key];
      }
    }
    this.roomSeats = new Array<LibrarySeat>();
  }
}

/**
 * 座位数据
 */
export interface LibrarySeatData {
  type: "seat" | "empty";
  id?: number;
  name?: string;
  status?: string;
  window?: boolean;
  power?: boolean;
  computer?: boolean;
  local?: boolean;
}

/**
 * 座位实体
 */
export class LibrarySeat implements LibrarySeatData {
  id: number;
  name: string;
  type: "seat";
  status: string;
  window: boolean;
  power: boolean;
  computer: boolean;
  local: boolean;
  startTimes: Array<LibrarySeatTime>;
  endTimes: Array<LibrarySeatTime>;
  constructor(parameters: LibrarySeatData) {
    for (const key in parameters) {
      if (parameters.hasOwnProperty(key)) {
        this[key] = parameters[key];
      }
    }
  }
}

/**
 * 预约时间模型
 */
export interface LibrarySeatTimeData {
  id?: string;
  value?: string;
  hour?: number;
  minute?: number;
}

/**
 * 预约时间
 */
export class LibrarySeatTime implements LibrarySeatTimeData {
  id?: string;
  value?: string;
  hour?: number;
  minute?: number;
  constructor(parameters: LibrarySeatTimeData) {
    if (parameters.id && parameters.value) {
      this.id = parameters.id;
      this.value = parameters.value;
      if (this.id !== "now") {
        [this.hour, this.minute] = this.value.split(":").map((value) => {
          return parseInt(value);
        })
      }
    } else if (parameters.hour && parameters.minute) {
      this.hour = parameters.hour;
      this.minute = parameters.minute;
      this.value = `${this.hour}:${this.minute}`;
      this.id = (this.hour * 60 + this.minute).toString();
    }
  }
}
