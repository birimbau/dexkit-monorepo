import { useWeb3React } from "@web3-react/core";
import axios from "axios";
import { useState } from "react";
import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteAccountFile, editAccountFile, getFilesByOwner, uploadAccountFile } from "../services/fileUploader";
import { useAuth, useLoginAccountMutation } from "./account";


export function useUploadAccountFile() {
  const [progress, setProgress] = useState<number>(0);
  const { isLoggedIn } = useAuth()
  const loginMutation = useLoginAccountMutation()
  const onUploadProgress = (event: any) => {
    const percentage = Math.round((100 * event.loaded) / event.total);
    setProgress(percentage)
  }
  const fileUploadMutation = useMutation(async (file: FormData) => {
    if (!isLoggedIn) {
      await loginMutation.mutateAsync()
    }
    return await uploadAccountFile(file, onUploadProgress);
  });

  return {
    fileUploadMutation,
    fileUploadProgress: progress
  }
}

export function useDeleteAccountFile() {

  const { isLoggedIn } = useAuth()
  const loginMutation = useLoginAccountMutation()

  return useMutation(async (id: number) => {
    if (!isLoggedIn) {
      await loginMutation.mutateAsync()
    }
    return await deleteAccountFile(id);
  });


}

export function useEditAccountFile() {
  const { isLoggedIn } = useAuth()
  const loginMutation = useLoginAccountMutation()

  return useMutation(async ({ id, newFileName }: { id: number, newFileName: string }) => {
    if (!isLoggedIn) {
      await loginMutation.mutateAsync()
    }
    return await editAccountFile(id, newFileName);
  });

}

const GET_ACCOUNT_FILES_BY_OWNER = 'GET_ACCOUNT_FILES_BY_OWNER';

export function useGetAccountFiles({ skip, search }: { skip?: number, search?: string }) {
  const { account } = useWeb3React()

  return useQuery([GET_ACCOUNT_FILES_BY_OWNER, account, search, skip], async () => {
    if (!account) {
      return;
    }
    const files = await getFilesByOwner(account, 20, skip, search);
    return files.data;

  })
}