import { DexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { useContext } from "react";
import { ImageGenerate } from "../types/ai";

export function useCompletation() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(
    async ({ messages }: { messages: { role: string; content: string }[] }) => {
      return (await instance?.post("/ai/completation", { messages }))?.data;
    }
  );
}

export function useImageGenerate() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async (body: ImageGenerate) => {
    return (await instance?.post<string[]>("/ai/image/generate", body))?.data;
  });
}

export function useSaveImages() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(async ({ urls }: { urls: string[] }) => {
    return (await instance?.post("/ai/image/save", { urls }))?.data;
  });
}

export function useGenVariants() {
  const { instance } = useContext(DexkitApiProvider);

  return useMutation(
    async ({ url, numImages }: { url: string; numImages: number }) => {
      return (
        await instance?.post<string[]>("/ai/image/variants", { url, numImages })
      )?.data;
    }
  );
}
