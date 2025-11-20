import type { Output } from "@/types/globaltype";

export const CodeRunner = async ({
  language,
  code,
  filename,
  roomId
}: {
  roomId:string;
  language: string | null;
  code: string | null;
  filename: string | null;
}): Promise<Output | string> => {
  const url = `${import.meta.env.VITE_server_url}/runcode`;

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      roomId,
      language,
      stdin: "Peter",
      files: [
        {
          name: filename,
          content: code,
        },
      ],
    }),
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Failed to call API");
    }

    const result: Output = await response.json();
    return result;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
  }
};
