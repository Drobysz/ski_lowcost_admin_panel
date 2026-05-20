export type NoticeTone = "info" | "error" | "success";

export interface Notice {
  tone: NoticeTone;
  text: string;
}

export type BadgeTone = "blue" | "orange" | "green" | "gray";
