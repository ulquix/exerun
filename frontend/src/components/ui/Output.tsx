import type { Output } from "@/types/globaltype";
const Outputbox = ({ codeObject }: { codeObject: Output }) => {
  const { stdout, stderr, exception, executionTime, error } = codeObject;

  return (
    <div className="mx-auto h-[70vh] w-[90vw] overflow-auto rounded-2xl border border-slate-900 bg-[#0c0a09] p-5 font-mono text-sm text-green-500 shadow-xl/30 md:w-lg lg:w-xl">
      <div>$ ~</div>

      <div className="mt-4 space-y-3">
        {stdout && (
          <div>
            <span className="text-gray-400">stdout:</span>
            <pre className="whitespace-pre-wrap">{stdout}</pre>
          </div>
        )}

        {stderr && (
          <div className="text-red-400">
            <span className="text-gray-400">stderr:</span>
            <pre className="whitespace-pre-wrap">{stderr}</pre>
          </div>
        )}

        {exception && (
          <div className="text-yellow-400">
            <span className="text-gray-400">exception:</span> {exception}
          </div>
        )}

        {error && (
          <div className="text-red-500">
            <span className="text-gray-400">error:</span> {error}
          </div>
        )}

        {executionTime !== null && (
          <div>
            <span className="text-gray-400">executionTime:</span>{" "}
            {executionTime} ms
          </div>
        )}
      </div>
    </div>
  );
};

export default Outputbox;
