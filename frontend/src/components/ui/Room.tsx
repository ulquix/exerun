import CodeEditor from "./CodeEditor";
import {
  useEventListener,
  useMutation,
  useSelf,
  useStorage,
  useUpdateMyPresence,
} from "@liveblocks/react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { useOthers } from "@liveblocks/react";
import Cursor from "./Cursor";
import { useState } from "react";
import { useParams } from "react-router";
import { CopyButton } from "./CopyButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "./Loader";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Outputbox from "./Output";
import { FILE_MAP } from "../../constants/filename";
import { setOutput } from "@/features/code";
const Room = () => {
  const dispatch = useDispatch()
  const notify = (text: string) => toast(text);
  const language = useStorage((root) => root.codeDetails.language);
  const updateLanguage = useMutation(({ storage }, newLanguage: string) => {
    const details = storage.get("codeDetails");
    const newFilename = FILE_MAP[newLanguage];
    details.set("language", newLanguage);
    details.set("filename", newFilename);
  }, []);
  const { id } = useParams<{ id: string }>();
  useEventListener(({ event }) => {
    if (event.type == "USER_JOINED") {
      notify(`${event.name} joined the room`);
    }
    if (event.type == "USER_LEFT") {
      notify(`${event.name} left the room`);
    }
    if(event.type == "CODE_OUTPUT"){
      dispatch(setOutput({...event.name}))
    }
  });
  const me = useSelf();
  const selector = useSelector((state: RootState) => state.todo);
  const codeSelector = useSelector((state: RootState) => state.code);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const updateMyPresence = useUpdateMyPresence();
  const others = useOthers();

  const handleMove = (e: React.PointerEvent) => {
    const offsetX = e.clientX - (selector?.totalWidth || 0);
    const offsetY = e.clientY - (selector?.totalHeight || 0);
    const height = selector.height;
    const width = selector.width;
    const hratio = (offsetY / height) * 100;
    const wratio = (offsetX / width) * 100;
    updateMyPresence({ cursor: { x: wratio, y: hratio } });
  };

  const handleLeave = () => {
    updateMyPresence({ cursor: null });
  };

  const rendered = Object.keys(FILE_MAP).map((key) => (
    <SelectItem
      key={key}
      value={key}
      className="bg-slate-700  text-slate-200 hover:bg-slate-600 focus:bg-slate-500"
    >
      {key}
    </SelectItem>
  ));
  return (
    <div className="min-h-screen w-full bg-[#020617] relative">
      <div
        className="flex flex-col md:right-10 lg:top-4 right-4 top-4 min-h-screen items-center pt-25"
        style={{
          background: "#020617",
          backgroundImage: `
        linear-gradient(to right, rgba(71,85,105,0.15) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(71,85,105,0.15) 1px, transparent 1px),
        radial-gradient(circle at 50% 50%, rgba(139,92,246,0.08) 0%, transparent 70%)
      `,
          backgroundSize: "32px 32px, 32px 32px, 100% 100%",
        }}
      >
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={false}
          theme="dark"
          transition={Bounce}
        />
        <Loader variable={language as string} />
        <div className="flex h-screen md:mt-1 gap-10 lg:m-0 w-full  mb-5 flex-col md:flex-row">
          <CodeEditor handleMove={handleMove} handleLeave={handleLeave} />
          <Outputbox codeObject={codeSelector} />
        </div>
        {others.map((other) => {
          const cursor = other.presence.cursor;
          if (!cursor) return null;
          return (
            <Cursor
              key={other.connectionId}
              x={cursor.x}
              y={cursor.y}
              color={other?.info?.color}
            />
          );
        })}

        <div className="absolute  md:right-7 lg:top-5  right-4 top-4">
          <div
            className={`absolute right-0 hover:bg-slate-800 top-0 w-12 h-12  bg-slate-900  text-white rounded-full shadow-md 
                flex items-center justify-center cursor-pointer transition-all duration-300
                ${isHovering ? "opacity-0 pointer-events-none scale-90" : "opacity-100 scale-100"}`}
            onClick={() => setIsHovering(true)}
          >
            <img
              src="/group.svg"
              alt="Group Icon"
              width={26}
              height={26}
              className="select-none text-white"
              onContextMenu={(e) => e.preventDefault()}
            />
          </div>

     <div
  className={`absolute right-0 top-0 z-999999 bg-slate-800 rounded-xl shadow-lg 
  max-sm:w-[75vw] max-lg:w-[40vw] w-[80vw] lg:w-96 lg:h-[50vh]
  transition-all duration-500 ease-in-out
  ${isHovering ? "opacity-100 translate-y-5" : "opacity-0 -translate-y-4 pointer-events-none"}
  overflow-y-auto no-scrollbar`}
>

<div className="flex justify-end p-3 bg-transparent">
              <img
                src="/cross.svg"
                alt="Close"
                width={28}
                height={28}
                className="cursor-pointer select-none hover:scale-110 transition-transform "
                onClick={() => setIsHovering(false)}
              />
            </div>

<div className="flex flex-col items-center px-4 h-full bg-transparent">
              <img
                src="/group.svg"
                alt="Logo"
                width={60}
                height={60}
                className="select-none mb-4 "
              />

              <CopyButton
                className="w-24 mb-6 "
                className2="hover:bg-slate-500"
                text={id || "not found"}
              />

              <div className="w-full   text-center space-y-2  text-slate-400 font-notdisplay no-scrollbar">
                <h2>Total participants: {(others?.length || 0) + 1}</h2>
                <div className="flex  items-center justify-around pb-4">
                  <div className="font-semibold shrink-0">Current Language</div>
                  <Select
                    value={language || ""}
                    onValueChange={(e) => updateLanguage(e)}
                  >
                    <SelectTrigger className="w-[150px] bg-slate-600 text-slate-200 border border-slate-500">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>

                    <SelectContent className="bg-slate-700 text-slate-200 z-99999999 border border-slate-500">
                      {rendered}
                    </SelectContent>
                  </Select>
                </div>
                <div className="py-2 px-3 bg-slate-700 text-slate-400 dark:bg-gray-700 rounded-lg flex items-center  gap-5 text-sm font-medium  dark:text-gray-200">
                  <h1>{`${me?.info?.name} (you)`}</h1>
                  <div
                    style={{
                      background: me?.info?.color,
                    }}
                    className="w-7 h-7 rounded-full border border-neutral-500"
                  ></div>
                </div>
                {others?.length > 0 ? (
                  others.map((other, idx) => (
                    <div
                      key={idx}
                      className="py-2 mb-5 px-3 bg-slate-700 text-slate-400 dark:bg-gray-700 rounded-lg flex items-center gap-5  text-sm font-medium dark:text-gray-200"
                    >
                      <h1>{other?.info?.name || "Unknown"}</h1>
                      <div
                        style={{
                          background: other?.info?.color,
                        }}
                        className="w-7 h-7 rounded-full border border-neutral-500"
                      ></div>
                    </div>
                  ))
                ) : (
                  <div className="text-slate-400 italic text-sm mt-4 pb-5">
                    No other users found
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Room;
