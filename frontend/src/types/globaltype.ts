
export interface UserData {
  name?: string;
  color?: string;
}

export interface FetchResponse {
  status: boolean;
}

export interface CursorProps {
  x: number;
  y: number;
  color?: string;
}
export interface Output {
  stdout: string;
  stderr: string;
  exception: string | null;
  executionTime: number;
  limitPerMonthRemaining: number;
  status: string;
  error?: string | null;
}
export interface HeightWidth {
  height: number;
  width: number;
  totalHeight?: number;
  totalWidth?: number;
}
