import { RestResponse } from "./RestResponse";
import axios, {AxiosResponse} from "axios"
import { LayoutByDateData } from "./LayoutByDateData";

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
  /**
   * 获取房间数据
   */
  async fetchRooms() {
    try {
      var room_rest: AxiosResponse<RestResponse<Array<LibraryRoomData>>> = await axios({
        url: `/rest/v2/room/stats2/${this.buildingID}/`,
        method: "GET"
      })
      if (room_rest.status === 200 && room_rest.data.status == "success") {
        if (room_rest.data.data && room_rest.data.data.length > 0) {
          this.buildingRooms = room_rest.data.data.map(value => {
            return new LibraryRoom(value);
          });
        } else {
          throw "服务器已响应，但无返回值";
        }
      } else {
        throw "服务器返回错误";
      }
    } catch (error) {
      throw error;
    }
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
  /**
   * 获取座位
   * @param bookDate 日期
   */
  async fetchSeats(bookDate: string) {
    try {
      var seat_rest: AxiosResponse<RestResponse<LayoutByDateData>> = await axios({
        url: `/rest/v2/room/layoutByDate/${this.roomId}/${bookDate}/`,
        method: "GET"
      })
      if (seat_rest.status === 200 && seat_rest.data.status === "success") {
        if (seat_rest.data.data) {
          var layout = seat_rest.data.data.layout;
          var seats = new Array<LibrarySeat>();
          for (const key in layout) {
            if (layout.hasOwnProperty(key)) {
              const element = layout[key];
              if (key == "1") { console.log("Layout element: ", JSON.stringify(element)); }
              if (element.type == "seat") {
                seats.push(new LibrarySeat(element));
              }
            }
          }
          this.roomSeats = seats;
        } else {
          throw "服务器已成功响应，但没有返回数据"
        }
      }
    } catch (error) {
      throw "服务器无响应"
    }
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
