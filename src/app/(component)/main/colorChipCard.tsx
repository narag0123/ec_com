"use client";
import { COLOR_MAP } from "../chart/colorMap";

export default function ColorChipCard() {
    return (
        <div className="w-full flex justify-end gap-5">
            <span className="flex items-center text-sm gap-2">
                완료:{" "}
                <div
                    className="w-4 h-4 rounded"
                    style={{
                        backgroundColor:
                            COLOR_MAP.month.true,
                    }}
                ></div>
                <div
                    className="w-4 h-4 rounded"
                    style={{
                        backgroundColor:
                            COLOR_MAP.quarter.true,
                    }}
                ></div>
                <div
                    className="w-4 h-4 rounded"
                    style={{
                        backgroundColor:
                            COLOR_MAP.half.true,
                    }}
                ></div>
            </span>
            <span className="flex items-center text-sm gap-2">
                미완료:{" "}
                <div
                    className="w-4 h-4 rounded"
                    style={{
                        backgroundColor:
                            COLOR_MAP.month.false,
                    }}
                ></div>
                <div
                    className="w-4 h-4 rounded"
                    style={{
                        backgroundColor:
                            COLOR_MAP.quarter.false,
                    }}
                ></div>
                <div
                    className="w-4 h-4 rounded"
                    style={{
                        backgroundColor:
                            COLOR_MAP.half.false,
                    }}
                ></div>
            </span>
        </div>
    );
}
