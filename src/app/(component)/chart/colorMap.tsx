// src/constants/colors.ts
export type TaskType = "month" | "quarter" | "half";
export type TaskStatus = "true" | "false";

export const COLOR_MAP: Record<
    TaskType,
    Record<TaskStatus, string>
> = {
    month: {
        true: "#d6d85d",
        false: "#ffb74d",
    },
    quarter: {
        true: "#b3cd3e",
        false: "#ff8c00",
    },
    half: {
        true: "#83b527",
        false: "#ff7f00",
    },
};
