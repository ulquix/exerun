import { LiveObject } from "@liveblocks/client";
declare global {
  interface Liveblocks {
    Presence: {
      cursor?: { x: number; y: number } | null;
    };
    Storage: {
      codeDetails: LiveObject<{
        language: string;
        code: string;
        filename: string;
      }>;
    };
    UserMeta: {
      id: string;
      info?: {
        name: string;
        color: string;
      };
    };
    RoomEvent:
      | { type: "USER_JOINED"; name: string }
      | { type: "USER_LEFT"; name: string }
      | {type:"CODE_OUTPUT";name:{
  stdout: string;
  stderr: string;
  exception: string | null;
  executionTime: number;
  limitPerMonthRemaining: number;
  status: string;
  error?: string | null;
}};
  }
}

export {};
