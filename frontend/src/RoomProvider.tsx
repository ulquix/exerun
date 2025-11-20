import React, { useEffect, useState, useTransition } from "react";
import uniqolor from "uniqolor";
import random from "random-string-generator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "./components/ui/CopyButton";
import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";
import Logo from "./components/ui/Logo";
import type { FetchResponse } from "./types/globaltype";
const RoomProvider = () => {
  const checkroom = async (): Promise<string> => {
    const id = random(12);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_server_url}/checkroom?id=${id}`,
      );
      const res: FetchResponse = await response.json();
      return res.status === false ? id : await checkroom();
    } catch {
      return await checkroom();
    }
  };

  const [room, setRoom] = useState("");
  const [joinroom, setjoinRoom] = useState("");
  const [color, setColor] = useState("");
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  useEffect(() => {
    checkroom().then((id) => {
      setRoom(id);
      const userdata = localStorage.getItem("userdata");

      if (userdata) {
        const parsed = JSON.parse(userdata);
        setName(parsed.name ?? "");
        if (parsed.color) setColor(parsed.color);
        else setColor(uniqolor(id).color);
      } else {
        setColor(uniqolor(id).color);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlenameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const handlecolorChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setColor(e.target.value);

  useEffect(() => {
    if (!name || !color) return;
    localStorage.setItem("userdata", JSON.stringify({ name, color }));
  }, [name, color]);

  const handleJoinSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    temproom: string,
  ) => {
    startTransition(async () => {
      e.preventDefault();
      const res = await fetch(
        `${import.meta.env.VITE_server_url}/prewarm/${temproom}`,
      );
      const js = await res.json();
      if (js.status === true) navigate(`/collaborative/${temproom}`);
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] relative">
      <div
        className="flex flex-col min-h-screen items-center pt-25"
        style={{
          background: "#020617",
          backgroundImage: `
            linear-gradient(to right, rgba(71,85,105,0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(71,85,105,0.3) 1px, transparent 1px),
            radial-gradient(circle at 50% 50%, rgba(139,92,246,0.15) 0%, transparent 70%)
          `,
          backgroundSize: "32px 32px, 32px 32px, 100% 100%",
        }}
      >
        <Logo className="pt-6 absolute   top-4 left-4 " />

        <Tabs
          defaultValue="create"
          className="w-full max-w-5xl mx-auto px-4 max-sm:mt-20"
        >
          <TabsList className=" h-auto mx-auto mb-5 md:mb-10 py-1 font-notdisplay flex items-center justify-center flex-wrap  bg-slate-700 ">
            <TabsTrigger
              value="create"
              className="cursor-pointer text-slate-200 data-[state=active]:bg-slate-500"
            >
              Create Room
            </TabsTrigger>

            <TabsTrigger
              value="join"
              className="cursor-pointer text-slate-200 data-[state=active]:bg-slate-500"
            >
              Join Room
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <Card className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 text-2xl mx-auto min-h-[45vh] bg-slate-700 border-gray-600">
              <CardHeader>
                <CardTitle className="font-notdisplay text-xl md:text-2xl font-medium text-slate-200">
                  Create new room
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-6 font-notdisplay">
                <form
                  onSubmit={(e) => handleJoinSubmit(e, room)}
                  className="grid gap-5 text-slate-200"
                >
                  <CopyButton
                    text={room}
                    className="text-base sm:text-lg font-notdisplay"
                  />

                  <div className="grid gap-2">
                    <Label htmlFor="create-name" className="text-sm">
                      Name
                    </Label>
                    <Input
                      id="create-name"
                      value={name}
                      required
                      onChange={handlenameChange}
                      placeholder="Enter your preferred name"
                      className="text-sm placeholder:text-base bg-slate-600 border-slate-600 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="create-color" className="text-sm">
                      Preferred Color
                    </Label>
                    <Input
                      id="create-color"
                      type="color"
                      className="w-20 sm:w-16 cursor-pointer rounded-full bg-slate-600 border-slate-600"
                      value={color}
                      onChange={handlecolorChange}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-3/4 mx-auto cursor-pointer text-slate-200 bg-gray-900 hover:bg-gray-800"
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Create Room"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="join">
            <Card className="w-full sm:w-3/4 md:w-1/2 lg:w-1/3 text-2xl mx-auto min-h-[45vh] bg-slate-700 border-gray-600">
              <CardHeader>
                <CardTitle className="font-notdisplay font-medium text-slate-200">
                  Join existing Room
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-6 font-notdisplay">
                <form
                  onSubmit={(e) => handleJoinSubmit(e, joinroom)}
                  className="grid gap-5 text-slate-200"
                >
                  <div className="grid gap-2">
                    <Label htmlFor="join-room" className="text-sm">
                      Room ID
                    </Label>
                    <Input
                      id="join-room"
                      value={joinroom}
                      required
                      onChange={(e) => setjoinRoom(e.target.value)}
                      placeholder="Enter room ID"
                      className="text-sm placeholder:text-base bg-slate-600 border-slate-600 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="join-name" className="text-sm">
                      Name
                    </Label>
                    <Input
                      id="join-name"
                      value={name}
                      required
                      onChange={handlenameChange}
                      placeholder="Enter your preferred name"
                      className="text-sm placeholder:text-base bg-slate-600 border-slate-600 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="join-color" className="text-sm">
                      Preferred Color
                    </Label>
                    <Input
                      id="join-color"
                      type="color"
                      className="w-20 sm:w-16 cursor-pointer rounded-full bg-slate-600 border-slate-600"
                      value={color}
                      onChange={handlecolorChange}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-3/4 mx-auto cursor-pointer text-slate-200 bg-gray-900 hover:bg-gray-800"
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Join Room"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RoomProvider;
