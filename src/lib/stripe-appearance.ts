import type { Appearance } from "@stripe/stripe-js";

/** Stripe-hosted fields styled to sit naturally inside the Zorro HUD. */
export const zorroStripeAppearance: Appearance = {
  theme: "night",
  inputs: "spaced",
  labels: "above",
  variables: {
    colorPrimary: "#ff7a18",
    colorBackground: "#0c0e13",
    colorText: "#e7e9ee",
    colorTextSecondary: "#9b9da4",
    colorTextPlaceholder: "#6f727a",
    colorDanger: "#ff6b6b",
    colorSuccess: "#51d88a",
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    fontSizeBase: "16px",
    fontSmooth: "always",
    spacingUnit: "4px",
    borderRadius: "0px",
    focusBoxShadow: "0 0 0 1px #ff7a18",
    focusOutline: "none",
  },
  rules: {
    ".Input": {
      backgroundColor: "#090b10",
      border: "1px solid rgba(255, 255, 255, 0.14)",
      boxShadow: "none",
      padding: "13px 14px",
    },
    ".Input:hover": {
      borderColor: "rgba(255, 255, 255, 0.26)",
    },
    ".Input:focus": {
      borderColor: "#ff7a18",
      boxShadow: "0 0 0 1px #ff7a18",
    },
    ".Input--invalid": {
      borderColor: "#ff6b6b",
      boxShadow: "0 0 0 1px #ff6b6b",
    },
    ".Label": {
      color: "#c9cbd1",
      fontSize: "13px",
      fontWeight: "500",
    },
    ".Tab": {
      backgroundColor: "#090b10",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      boxShadow: "none",
    },
    ".Tab:hover": {
      borderColor: "rgba(255, 122, 24, 0.65)",
      color: "#e7e9ee",
    },
    ".Tab--selected": {
      backgroundColor: "rgba(255, 122, 24, 0.08)",
      borderColor: "#ff7a18",
      boxShadow: "0 0 0 1px #ff7a18",
    },
    ".AccordionItem": {
      backgroundColor: "#090b10",
      border: "1px solid rgba(255, 255, 255, 0.12)",
      boxShadow: "none",
    },
    ".Error": {
      color: "#ff8a8a",
      fontSize: "13px",
    },
  },
};
