import { Liveblocks } from "@liveblocks/node";
import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";


interface AuthRequestBody {
  userId: string;
  roomId: string;
  color?: string;
}

interface RoomEmptyBody {
  type: "userEntered" | "userLeft";
  data: {
    numActiveUsers: number;
    roomId: string;
    userId: string;
  };
}

interface RunCodeBody {
  roomId:string;
  language: string;
  stdin?: string;
  files: {
    name: string;
    content: string;
  }[];
}

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS as string,
});

const app = express();

app.use(
  cors({
    origin: [
     (process.env.cors_url|| ""),(process.env.cors_url2 || ""),"http://localhost:5173"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req: Request, res: Response) => {

  res.status(200).send("Hello World!");
});

app.post("/auth", async (req: Request<{}, {}, AuthRequestBody>, res: Response) => {
  try {
    const { userId, roomId, color } = req.body;

    if (!userId || !roomId) {
      return res.status(400).json({ error: "userId and roomId required" });
    }

    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name: userId,
        color,
      },
    });

    session.allow(roomId, session.FULL_ACCESS );

    const { body, status } = await session.authorize();
    return res.status(status).send(body);
  } catch (err) {
    console.error("Auth error:", err);
    res.status(500).json({ error: "Failed to authorize Liveblocks session" });
  }
});

app.get("/checkroom", async (req: Request, res: Response) => {
  try {
    const rawId = req.query.id;
    if (typeof rawId !== "string") {
      return res.status(400).send("Invalid room ID");
    }

    await liveblocks.getRoom(rawId);
    return res.status(200).json({ status: true });
  } catch {
    return res.status(200).json({ status: false });
  }
});

app.get("/prewarm/:id", async (req: Request, res: Response) => {
  const roomId = req.params.id;

  try {
    await liveblocks.getOrCreateRoom(roomId, {
      defaultAccesses: ["room:write"],
    });

    await liveblocks.prewarmRoom(roomId);
    return res.json({ status: true });
  } catch (error) {
    console.log(error);
    return res.json({ status: false });
  }
});

app.post(
  "/roomEmpty",
  async (req: Request<{}, {}, RoomEmptyBody>, res: Response) => {
    try {
      const { type, data } = req.body;
      const { numActiveUsers, roomId, userId } = data;

      if (!roomId) return res.status(400).json({ error: "roomId missing" });

      if (type === "userEntered") {
        await liveblocks.broadcastEvent(roomId, {
          type: "USER_JOINED",
          name: userId,
        });
      } else if (type === "userLeft") {
        if (numActiveUsers <= 0) {
          await liveblocks.deleteRoom(roomId);
        } else {
          await liveblocks.broadcastEvent(roomId, {
            type: "USER_LEFT",
            name: userId,
          });
        }
      }

      return res.json({ status: "ok" });
    } catch (error) {
      console.error("roomEmpty error:", error);
      return res.status(500).json({ error: "Failed" });
    }
  }
);

app.post(
  "/runcode",
  async (req: Request<{}, {}, RunCodeBody>, res: Response) => {
    try {
      const url = process.env.onecompiler_url!;
      const body = req.body;
      const {roomId} =body;
      const options: RequestInit = {
        method: "POST",
        headers: {
          "x-rapidapi-key": process.env.onecompiler_api_key!,
          "x-rapidapi-host": process.env.onecompiler_host!,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      };

      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error("Failed to call API");
      }

      const result = await response.json();
      await liveblocks.broadcastEvent(roomId, {
            type: "CODE_OUTPUT",
            name: result,
          });
      return res.status(200).json(result);
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(500).json({ error: String(error) });
    }
  }
);

if (process.env.NODE_ENV !== "production") {
  const port = 3000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

export default app;
