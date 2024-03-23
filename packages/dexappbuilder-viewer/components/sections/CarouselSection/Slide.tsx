import Link from "@dexkit/ui/components/AppLink";
import { Stack, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from "react";
import { SlideActionType } from "../../../types";

export interface SlideProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  imageUrl: string;
  action?: SlideActionType;
}

export default function Slide({
  title,
  subtitle,
  action,
  imageUrl,
}: SlideProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box sx={{ position: "relative", height: "500px", width: "100%" }}>
        <Box
          sx={{
            backgroundImage: `linear-gradient(
              rgba(0, 0, 0, 0.0), 
              rgba(0, 0, 0, 0.90)
            ), url(${imageUrl})`,
            aspectRation: "16/9",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            position: "absolute",
            width: "100%",
            height: "100%",
            display: "block",
          }}
        />
        <Stack
          sx={{
            position: "absolute",
            display: "block",
            bottom: (theme) => theme.spacing(4),
            left: (theme) => theme.spacing(4),
            right: (theme) => theme.spacing(4),
            p: 4,
          }}
          spacing={2}
        >
          <Box
            sx={{
              zIndex: 5,
            }}
          >
            <Typography variant="h5">{title}</Typography>
            {subtitle && (
              <Typography variant="h6" fontWeight="400">
                {subtitle}
              </Typography>
            )}
          </Box>
          {action && (
            <Box>
              {action.type === "link" && (
                <Button
                  variant="contained"
                  LinkComponent={Link}
                  href={action.url}
                >
                  {action.caption}
                </Button>
              )}
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
