import { Editor, loader } from "@monaco-editor/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useEffect, useRef, useState, useTransition } from "react";
import * as monaco from "monaco-editor";
import { updateHW } from "../../features/heightWidth";
import { setOutput } from "../../features/code";
import type { Output } from "@/types/globaltype";
import { useDispatch } from "react-redux";
import { useMutation, useStorage } from "@liveblocks/react";
import { CodeRunner } from "../../hooks/codeRunner";
import { Loader } from "lucide-react";
import { useParams } from "react-router";
function CodeEditor({
  handleLeave,
  handleMove,
}: {  
  handleLeave: () => void;
  handleMove: (e: React.PointerEvent) => void;
}) {
const {id}= useParams()
  const code = useStorage((root) => root.codeDetails.code);
  const filename = useStorage((root) => root.codeDetails.filename) || "main.js";

  const language = useStorage((root) => root.codeDetails.language);
  const updateCode = useMutation(({ storage }, newCode: string) => {
    const details = storage.get("codeDetails");
    details.set("code", newCode);
  }, []);
  const dispatch = useDispatch();
  const reference = useRef<HTMLDivElement>(null);

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  const [UndoRedoState, setUndoRedoState] = useState<{
    canUndo: boolean;
    canRedo: boolean;
  }>({ canUndo: false, canRedo: false });
  loader.init();
  // .then((monaco) => console.log("here is the monaco instance:", monaco));

  function useUndo() {
    editorRef.current?.trigger("", "undo", null);
  }
  function useRedo() {
    editorRef.current?.trigger("", "redo", null);
  }
  function handleValueChange(value: string | undefined) {
    const canUndo = editorRef.current?.getModel()?.canUndo() || false;
    const canRedo = editorRef.current?.getModel()?.canRedo() || false;
    if (
      UndoRedoState.canUndo !== canUndo ||
      UndoRedoState.canRedo !== canRedo
    ) {
      setUndoRedoState({ canUndo, canRedo });
    }
    if (value) {
      updateCode(value);
    } else updateCode("");
  }
  const [isPending, startTransition] = useTransition();

  function runcode() {
    startTransition(async () => {
      const response: Output | string = await CodeRunner({
        roomId:id||"",
        language,
        code,
        filename,
      });
      if (typeof response == "string") return;
      const {
        exception,
        executionTime,
        limitPerMonthRemaining,
        status,
        stderr,
        stdout,
        error,
      } = response;
      dispatch(
        setOutput({
          exception,
          executionTime,
          limitPerMonthRemaining,
          status,
          stderr,
          stdout,
          error,
        }),
      );
      return;
    });
  }

useEffect(() => {
  if (!reference.current) return;

  const el = reference.current;

  const update = () => {
    const rect = el.getBoundingClientRect();
    dispatch(
      updateHW({
        height: el.clientHeight,
        width: el.clientWidth,
        totalHeight: rect.top,
        totalWidth: rect.left,
      })
    );
  };

  const observer = new ResizeObserver(() => {
    update();
  });

  observer.observe(el);

  // Trigger once
  update();

  window.addEventListener("scroll", update);

  return () => {
    observer.disconnect();
    window.removeEventListener("scroll", update);
  };
}, [reference, dispatch]);

  return (
    <>
      <div className="mx-auto flex h-[90vh] w-[90vw] flex-col overflow-hidden rounded-xl border border-slate-900 bg-slate-900 shadow-xl/30 md:h-3/4 md:w-lg lg:w-[50vw]">
        <div className="flex items-center gap-4 bg-neutral-900 px-4 py-2">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-(--red)"></span>
            <span className="h-3 w-3 rounded-full bg-(--yellow)"></span>
            <span className="h-3 w-3 rounded-full bg-(--green)"></span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={useUndo}
              className={`cursor-pointer ${
                UndoRedoState.canUndo ? "text-zinc-100" : "text-gray-500"
              }`}
              aria-label="Undo"
            >
              <ArrowBackIcon />
            </button>
            <button
              type="button"
              onClick={useRedo}
              className={`cursor-pointer ${
                UndoRedoState.canRedo ? "text-zinc-100" : "text-gray-500"
              }`}
              aria-label="Redo"
            >
              <ArrowForwardIcon />
            </button>
          </div>
          <div className="rounded-xs px-2 text-neutral-600">{filename}</div>
          <div className="mr-5 flex flex-1 justify-end">
            {isPending ? (
              <Loader color="red" className="animate-spin" />
            ) : (
              <button
                onClick={runcode}
                disabled={isPending}
                className={`${isPending ? "text-red-200" : "text-red-500"} min-w-4 cursor-pointer font-bold`}
              >
                run{" "}
              </button>
            )}
          </div>
        </div>
        <div
          className="h-screen flex-1"
          onPointerMove={handleMove}
          onPointerLeave={handleLeave}
          ref={reference}
        >
          <Editor
            height="100%"
            width="100%"
            className=""
            language={language || ""}
            theme="custom-dark"
            onChange={handleValueChange}
            onMount={(editor) => {
              editorRef.current = editor;
              editor.focus();
              window.addEventListener("resize", () => editor.layout());
            }}
            beforeMount={(monaco) => {
              monaco.editor.defineTheme("custom-dark", {
                base: "vs-dark",
                inherit: true,
                rules: [],
                colors: {
                  "editor.background": "#0c0a09",
                  "editorCursor.foreground": "#c70036",
                  "editor.selectionBackground": "#62748e",
                },
              });
            }}
            options={{
              fontSize: 14,
              fontFamily: "JetBrains Mono, monospace",
              lineNumbers: "on",
              minimap: { enabled: true },
              smoothScrolling: true,
              wordWrap: "on",
              cursorBlinking: "smooth",
              padding: { top: 10 },
            }}
            value={code || ""}
          />
        </div>
      </div>
    </>
  );
}

export default CodeEditor;
