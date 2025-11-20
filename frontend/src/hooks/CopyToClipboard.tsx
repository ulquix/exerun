import { useState } from "react";

export function useCopyToClipboard() {
  const [isCopied, setIsCopied] = useState(false);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 1500);
    } catch (error) {
      console.error("Copy failed", error);
      setIsCopied(false);
    }
  };

  return [copy, isCopied] as const;
}
