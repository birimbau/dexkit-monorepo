import { Button } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";

import "react-mask-editor/dist/style.css";

export interface EditTabProps {
  imageUrl: string;
}

export default function EditTab({ imageUrl }: EditTabProps) {
  const canvas = React.useRef<HTMLCanvasElement | null>(null);
  const circleCanvas = React.useRef<HTMLCanvasElement | null>(null);
  const maskCanvas = React.useRef<HTMLCanvasElement | null>(null);

  const circleCtx = React.useRef<CanvasRenderingContext2D | null>(null);
  const maskCtx = React.useRef<CanvasRenderingContext2D | null>(null);
  const ctx = React.useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvas.current && circleCanvas.current && maskCanvas.current) {
      ctx.current = canvas.current?.getContext("2d");
      circleCtx.current = circleCanvas.current?.getContext("2d");
      maskCtx.current = maskCanvas.current?.getContext("2d");

      let img = new Image(512, 512);
      img.src = imageUrl;

      if (maskCtx.current) {
        maskCtx.current.fillStyle = "rgba(0,0,0,1)";
        maskCtx.current?.fillRect(0, 0, 512, 512);
      }

      img.onload = () => {
        ctx.current?.drawImage(img, 0, 0);
      };
    }
  }, [imageUrl]);

  const [isPressed, setIsPressed] = useState(false);
  const [imageMask, setImageMask] = useState<string>();

  const handleMouseDown = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const handleDrawCircle = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) => {
      if (circleCanvas.current) {
        var rect = circleCanvas.current?.getBoundingClientRect();

        const ctx = circleCtx.current;
        ctx?.clearRect(0, 0, 512, 512);
        ctx?.beginPath();
        if (ctx) {
          ctx.fillStyle = "rgba(255, 0, 0, 1)";
          ctx.lineWidth = 0;
        }

        ctx?.arc(
          event.clientX - rect.left,
          event.clientY - rect.top,
          20,
          0,
          2 * Math.PI
        );
        ctx?.fill();
      }

      if (maskCanvas.current && isPressed) {
        var rect = maskCanvas.current?.getBoundingClientRect();

        const ctx = maskCtx.current;

        ctx?.beginPath();

        if (ctx) {
          ctx.fillStyle = "rgba(255, 0, 0, 1)";
          ctx.lineWidth = 0;
          ctx.strokeStyle = "none";
          ctx.imageSmoothingEnabled = false;
        }

        ctx?.arc(
          event.clientX - rect.left,
          event.clientY - rect.top,
          20,
          0,
          2 * Math.PI
        );
        ctx?.fill();
      }
    },
    [
      circleCtx.current,
      isPressed,
      maskCtx.current,
      maskCanvas.current,
      circleCanvas.current,
    ]
  );

  const handleClear = () => {
    if (maskCanvas.current && maskCtx.current) {
      maskCtx.current.clearRect(0, 0, 512, 512);
    }
  };

  const handleGetMask = useCallback(() => {
    if (maskCanvas.current && maskCtx.current) {
      const canvas = maskCanvas.current;
      // Get the 2D rendering context
      var ctx = maskCtx.current;

      // Get the canvas width and height
      var width = canvas.width;
      var height = canvas.height;

      let tempCanvas = document.createElement("canvas");

      tempCanvas.width = maskCanvas.current.width;
      tempCanvas.height = maskCanvas.current.height;

      let tempCtx = tempCanvas.getContext("2d");

      if (tempCtx && tempCanvas && maskCtx.current) {
        let imageData = maskCtx.current.getImageData(0, 0, width, height);

        tempCtx.putImageData(imageData, 0, 0);

        tempCanvas.width = imageData.width;
        tempCanvas.height = imageData.height;
      }

      // Get the canvas image data
      var imageData = maskCtx.current.getImageData(0, 0, width, height);

      var data = imageData?.data; // Array containing pixel data: [r, g, b, a, r, g, b, a, ...]

      if (data && imageData) {
        for (var i = 0; i < data.length; i += 4) {
          // Each pixel occupies 4 array elements: [r, g, b, a]
          var red = data[i];
          var green = data[i + 1];
          var blue = data[i + 2];
          var alpha = data[i + 3];

          if (red === 255 && green === 0 && blue === 0 && alpha === 1) {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
            data[i + 3] = 1;
          } else {
            data[i + 3] = 0;
          }
        }

        if (tempCtx) {
          tempCtx.putImageData(imageData, 0, 0);
        }

        const url = tempCanvas.toDataURL();

        setImageMask(url);
        handleClear();
      }
    }
  }, [maskCanvas.current, maskCtx.current, handleClear]);

  return (
    <div>
      {imageMask && (
        <img
          src={imageMask}
          key={imageMask}
          style={{
            display: "block",
            width: 512,
            height: 512,
            aspectRatio: "1/1",
          }}
        />
      )}
      <div style={{ position: "relative", width: 512, height: 512 }}>
        <canvas
          width={512}
          height={512}
          style={{ position: "absolute" }}
          ref={(ref) => (canvas.current = ref)}
        />

        <canvas
          width={512}
          height={512}
          style={{ position: "absolute", opacity: 0.4 }}
          ref={(ref) => (maskCanvas.current = ref)}
        />

        <canvas
          width={512}
          height={512}
          style={{ position: "absolute" }}
          ref={(ref) => (circleCanvas.current = ref)}
          onMouseMove={handleDrawCircle}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        />
      </div>
      <Button onClick={handleGetMask}>Save</Button>
    </div>
  );
}
