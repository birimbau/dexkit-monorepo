import { DexkitApiProvider } from "@dexkit/core/providers";
import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useContext } from "react";
import { useIntl } from "react-intl";
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

  const { enqueueSnackbar } = useSnackbar();

  return useMutation(
    async (body: ImageGenerate) => {
      return (await instance?.post<string[]>("/ai/image/generate", body))?.data;
    },
    {
      onError: (err) => {
        enqueueSnackbar(String(err), { variant: "error" });
      },
    }
  );
}

export function useSaveImages() {
  const { instance } = useContext(DexkitApiProvider);

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  return useMutation(
    async ({ urls }: { urls: string[] }) => {
      return (await instance?.post("/ai/image/save", { urls }))?.data;
    },
    {
      onSuccess: () => {
        enqueueSnackbar(
          formatMessage({ id: "saved", defaultMessage: "Saved" }),
          { variant: "success" }
        );
      },
      onError: (err) => {
        enqueueSnackbar(String(err), { variant: "error" });
      },
    }
  );
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
