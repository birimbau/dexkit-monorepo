import {
  ColorSystemOptions,
  CssVarsTheme,
  experimental_extendTheme,
} from "@mui/material";
import get from "lodash/get";
import z from "zod";

const RefereceSchema = z.object({
  $ref: z.string(),
});

type RefereceType = z.infer<typeof RefereceSchema>;

const ColorSchema = z.string().or(RefereceSchema).optional();

const ThemeColorsSchema = z.object({
  primary: ColorSchema,
  secondary: ColorSchema,
  error: ColorSchema,
  warning: ColorSchema,
  info: ColorSchema,
  success: ColorSchema,
  text: ColorSchema,
  textSecondary: ColorSchema,
});

const palleteType = z.enum(["simple", "withDarkTheme"]);

const SimplePalleteSchema = z.object({
  type: z.literal(palleteType.enum.simple),
  colors: ThemeColorsSchema,
});

const WithDarkThemePalleteSchema = z.object({
  dark: ThemeColorsSchema,
  light: ThemeColorsSchema,
  type: z.literal(palleteType.enum.withDarkTheme),
});

export const ThemePaletteSchema = z.discriminatedUnion("type", [
  SimplePalleteSchema,
  WithDarkThemePalleteSchema,
]);

const ThemeSchema = z.object({
  palette: ThemePaletteSchema,
  shape: z.object({ borderRadius: z.number() }).optional(),
});

type ThemeType = z.infer<typeof ThemeSchema>;

function getColor(key: string, theme: ThemeType) {
  if (theme.palette.type === "simple") {
    const obj: any = get(theme, `palette.colors.${key}`);

    if (typeof obj === "string") {
      return obj;
    } else {
      return (obj as RefereceType)?.$ref;
    }
  }
}

export function parseTheme(data: ThemeType): CssVarsTheme {
  const parser = ThemeSchema;

  const themeData = parser.parse(data);

  if (themeData.palette.type === "simple") {
    const primaryColor = getColor("primary", themeData);
    const secondaryColor = getColor("secondary", themeData);
    const warningColor = getColor("warning", themeData);
    const infoColor = getColor("info", themeData);
    const successColor = getColor("success", themeData);
    const textColor = getColor("text", themeData);
    const errorColor = getColor("error", themeData);
    const dividerColor = getColor("divider", themeData);
    const borderRadius = themeData.shape?.borderRadius;

    const colors: ColorSystemOptions = {
      palette: {},
    };

    if (colors.palette) {
      if (primaryColor) {
        colors.palette.primary = { main: primaryColor };
      }
      if (secondaryColor) {
        colors.palette.primary = { main: secondaryColor };
      }

      if (errorColor) {
        colors.palette.primary = { main: errorColor };
      }

      if (warningColor) {
        colors.palette.warning = { main: warningColor };
      }

      if (successColor) {
        colors.palette.success = { main: successColor };
      }

      if (infoColor) {
        colors.palette.success = { main: infoColor };
      }

      if (textColor) {
        colors.palette.text = { primary: textColor };
      }

      if (dividerColor) {
        colors.palette.divider = dividerColor;
      }
    }

    let shape: any = {};

    if (borderRadius !== undefined) {
      shape.borderRadius = borderRadius;
    }

    return experimental_extendTheme({
      colorSchemes: { dark: colors, light: colors },
      shape,
    });
  }

  return experimental_extendTheme({});
}
