import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/CopyToClipboard";
import { cn } from "../../lib/utils";

export function CopyButton({
  text,
  className,
  className2,
}: {
  text: string;
  className?: string;
  className2?: string;
}) {
  const [copy, isCopied] = useCopyToClipboard();

  const handleCopy = () => {
    copy(text);
  };

  return (
    <div className={cn("flex items-center gap-2 ", className)}>
      <pre className="flex-1 bg-slate-600 p-2 rounded text-slate-400 cursor-not-allowed">
        {text}
      </pre>
      <Button
        onClick={handleCopy}
        className={cn(
          "cursor-pointer hover:bg-gray-800 bg-gray-900",
          className2,
        )}
      >
        {isCopied ? "Copied!" : "Copy"}
      </Button>
    </div>
  );
}
