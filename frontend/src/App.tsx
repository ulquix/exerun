import { Routes, Route } from "react-router";

import { CollaborativeEditor } from "./CollaborativeEditor";
import RoomProvider from "./RoomProvider";
export default function App() {
  return (
    <>
      <Routes>
        <Route path="/collaborative/:id" element={<CollaborativeEditor />} />
        <Route path="/" element={<RoomProvider />} />
      </Routes>
    </>
  );
}
