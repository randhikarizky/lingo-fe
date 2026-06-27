import { Shadows } from "@mui/material/styles";

export function shadows(_mode: "light" | "dark"): Shadows {
  return Array(25).fill("none") as Shadows;
}
