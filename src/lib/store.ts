import { persisted } from "svelte-persisted-store";

export const preferences = persisted<{ navigationControls: "mouse" | "gesture" }>("preferences", {
  navigationControls: "gesture",
});
