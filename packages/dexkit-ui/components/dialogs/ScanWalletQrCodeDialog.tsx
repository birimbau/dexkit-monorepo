import { useAsyncMemo } from "@dexkit/widgets/src/hooks";
import {
  Dialog,
  DialogContent,
  DialogProps,
  Divider,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import QrScanner from "qr-scanner";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { AppDialogTitle } from "../AppDialogTitle";
import QrCodeScanner from "../QrCodeScanner";

export interface ScanWalletQrCodeDialogProps {
  DialogProps: DialogProps;
  onResult: (result: string) => void;
}

export default function ScanWalletQrCodeDialog({
  DialogProps,
  onResult,
}: ScanWalletQrCodeDialogProps) {
  const [camera, setCamera] = useState<string>();

  const { onClose } = DialogProps;

  const handleClose = () => {
    if (onClose) {
      onClose({}, "backdropClick");
    }
  };

  const cameras = useAsyncMemo(
    async () => {
      return await QrScanner.listCameras();
    },
    [],
    []
  );

  useEffect(() => {
    if (cameras.length > 0) {
      setCamera(cameras[0].id);
    }
  }, [cameras]);

  return (
    <Dialog {...DialogProps}>
      <AppDialogTitle
        title={
          <FormattedMessage id="scan.wallet" defaultMessage="Scan wallet" />
        }
        onClose={handleClose}
      />
      <Divider />
      <DialogContent>
        <Stack spacing={2}>
          <Select
            value={camera}
            onChange={(e: SelectChangeEvent<string>) =>
              setCamera(e.target.value)
            }
          >
            {cameras.map((camera) => (
              <MenuItem key={camera.id} value={camera.id}>
                {camera.label}
              </MenuItem>
            ))}
          </Select>
          {camera && (
            <QrCodeScanner cameraId={camera} key={camera} onResult={onResult} />
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
