import { LibrarySeatData } from "./LibraryModel";

interface Layout {
  [layoutID: string]: LibrarySeatData
}

/**
 * LayoutByDate接口返回的数据
 */
export class LayoutByDateData {
  id: number;
  name: string;
  cols: number;
  rows: number;
  layout: Layout
}