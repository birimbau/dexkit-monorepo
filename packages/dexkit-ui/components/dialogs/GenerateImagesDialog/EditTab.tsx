import React from "react";
import { MaskEditor } from "react-mask-editor";

export interface EditTabProps {}

export default function EditTab({}: EditTabProps) {
  const canvas = React.useRef<HTMLCanvasElement>(
    document.createElement(`canvas`)
  );

  return <MaskEditor src="https://placekitten/256/256" canvasRef={canvas} />;
}
