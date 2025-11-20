import {
  ClientSideSuspense,
  LiveblocksProvider,
  RoomProvider,
} from "@liveblocks/react";
import { ErrorBoundary } from "react-error-boundary";
import Room from "./components/ui/Room";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { LiveObject } from "@liveblocks/client";
import type { UserData } from "./types/globaltype";
export const CollaborativeEditor = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<UserData>({});

  useEffect(() => {
    const stored = localStorage.getItem("userdata");
    if (stored) setData(JSON.parse(stored));
  }, []);
  if (!id || !data.name) {
    return <div>user invalid</div>;
  }

  return (
    <LiveblocksProvider
      authEndpoint={async (room) => {
        const response = await fetch(
          `${import.meta.env.VITE_server_url}/auth`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: data.name,
              color: data.color,
              roomId: room,
            }),
          },
        );
        return await response.json();
      }}
    >
      <ErrorBoundary fallback={<div>Error</div>}>
        <ClientSideSuspense fallback={<div>Loading...</div>}>
          <RoomProvider
            id={id}
            initialPresence={{
              cursor: null,
            }}
            initialStorage={{
              codeDetails: new LiveObject({
                code: "//wellcome to the collaborative editor try typing something here",
                language: "javascript",
                filename: "main.js",
              }),
            }}
          >
            <Room />
          </RoomProvider>
        </ClientSideSuspense>
      </ErrorBoundary>
    </LiveblocksProvider>
  );
};
