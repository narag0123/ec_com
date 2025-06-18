import { DocumentData } from "firebase/firestore";
import { OutsideAdjustmentMap } from "../(pages)/main";

export const progressRate = (
    task: Record<string, boolean> | undefined
): number => {
    if (!task) return 0;
    const values = Object.values(task);
    const done = values.filter((v) => v).length;
    return values.length === 0 ? 0 : done / values.length;
};

const getQuarterIndex = (month: number) =>
    Math.floor((month - 1) / 3); // 0~3
const getHalfIndex = (month: number) =>
    Math.floor((month - 1) / 6); // 0~1

export const getOutsideAdjustment = (
    tunnelData: DocumentData[]
): OutsideAdjustmentMap => {
    const result: OutsideAdjustmentMap = {
        quarter: new Set(),
        half: new Set(),
    };

    tunnelData.forEach((entry, index) => {
        if (entry.outsideTask === true) {
            const month = index + 1;
            result.quarter.add(getQuarterIndex(month));
            result.half.add(getHalfIndex(month));
        }
    });

    return result;
};

export const getQuarterRange = (
    month: number
): [number, number] => {
    const quarter = Math.ceil(month / 3);
    const start = (quarter - 1) * 3;
    return [start, start + 2];
};

export const getQuarterCorrectedTask = (
    data: Record<string, DocumentData[]>,
    tunnel: string,
    month: number
): Record<string, boolean> => {
    const tunnelData = data?.[tunnel] ?? [];
    const [start, end] = getQuarterRange(month);
    const quarterIndex = getQuarterIndex(month);

    const quarterSlice = tunnelData.slice(start, end + 1);
    if (quarterSlice.length === 0) return {};

    const outsideAdj = getOutsideAdjustment(tunnelData);
    const taskKeys = Object.keys(
        quarterSlice[0]?.quarterTask ?? {}
    );
    const correctedTask: Record<string, boolean> = {};

    for (const key of taskKeys) {
        const hasTrue = quarterSlice.some(
            (entry) => entry?.quarterTask?.[key]
        );

        if (
            key === "thermal" &&
            outsideAdj.quarter.has(quarterIndex)
        ) {
            correctedTask[key] = true; // 외부점검으로 인한 보정
        } else {
            correctedTask[key] = hasTrue;
        }
    }

    return correctedTask;
};

const getHalfRange = (month: number): [number, number] => {
    const half = month <= 6 ? 0 : 6;
    return [half, half + 5]; // 0~5 or 6~11
};

export const getHalfCorrectedTask = (
    data: Record<string, DocumentData[]>,
    tunnel: string,
    month: number
): Record<string, boolean> => {
    const tunnelData = data?.[tunnel] ?? [];
    const [start, end] = getHalfRange(month);
    const halfIndex = getHalfIndex(month);

    const halfSlice = tunnelData.slice(start, end + 1);
    if (halfSlice.length === 0) return {};

    const outsideAdj = getOutsideAdjustment(tunnelData);
    const taskKeys = Object.keys(
        halfSlice[0]?.halfTask ?? {}
    );
    const correctedTask: Record<string, boolean> = {};

    for (const key of taskKeys) {
        const hasTrue = halfSlice.some(
            (entry) => entry?.halfTask?.[key]
        );

        if (
            key === "ground" &&
            outsideAdj.half.has(halfIndex)
        ) {
            correctedTask[key] = true;
        } else {
            correctedTask[key] = hasTrue;
        }
    }

    return correctedTask;
};
