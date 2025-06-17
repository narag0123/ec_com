"use client";
import { getMonth } from "date-fns";
import { useEffect, useState } from "react";
import { getAllData } from "../service/firebase-data-service";
import { DocumentData } from "firebase/firestore";
import TaskStatusPieChart from "../(component)/chart/taskPieChart";
import { COLOR_MAP } from "../(component)/chart/colorMap";

const tunnelList: string[] = [
    "광장",
    "화랑",
    "백현",
    "정자",
    "성내미",
    "소음저감",
];

export default function Main_Page() {
    const date = new Date();
    const monthIndex: number = getMonth(date) + 1;

    const [data, setData] =
        useState<Record<string, DocumentData[]>>();

    useEffect(() => {
        const fetchData = async () => {
            const result = await getAllData(tunnelList);
            setData(result);
        };
        fetchData();
    }, []);

    const getQuarterIndex = (month: number) =>
        Math.floor((month - 1) / 3); // 0~3
    const getHalfIndex = (month: number) =>
        Math.floor((month - 1) / 6); // 0~1

    type OutsideAdjustmentMap = {
        quarter: Set<number>; // 0 ~ 3
        half: Set<number>; // 0 ~ 1
    };

    const getOutsideAdjustment = (
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

    const getQuarterRange = (
        month: number
    ): [number, number] => {
        const quarter = Math.ceil(month / 3);
        const start = (quarter - 1) * 3;
        return [start, start + 2];
    };

    const getQuarterCorrectedTask = (
        tunnel: string,
        month: number
    ): Record<string, boolean> => {
        const tunnelData = data?.[tunnel] ?? [];
        const [start, end] = getQuarterRange(month);
        const quarterIndex = getQuarterIndex(month);

        const quarterSlice = tunnelData.slice(
            start,
            end + 1
        );
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

    const getHalfRange = (
        month: number
    ): [number, number] => {
        const half = month <= 6 ? 0 : 6;
        return [half, half + 5]; // 0~5 or 6~11
    };

    const getHalfCorrectedTask = (
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

    const progressRate = (
        task: Record<string, boolean> | undefined
    ): number => {
        if (!task) return 0;
        const values = Object.values(task);
        const done = values.filter((v) => v).length;
        return values.length === 0
            ? 0
            : done / values.length;
    };

    return (
        <div>
            <div>
                <div className="w-full flex justify-end text-lg gap-5">
                    <span className="flex items-center gap-2">
                        완료:{" "}
                        <div
                            className="w-5 h-5 rounded"
                            style={{
                                backgroundColor:
                                    COLOR_MAP.month.true,
                            }}
                        ></div>
                        <div
                            className="w-5 h-5 rounded"
                            style={{
                                backgroundColor:
                                    COLOR_MAP.quarter.true,
                            }}
                        ></div>
                        <div
                            className="w-5 h-5 rounded"
                            style={{
                                backgroundColor:
                                    COLOR_MAP.half.true,
                            }}
                        ></div>
                    </span>
                    <span className="flex items-center gap-2">
                        미완:{" "}
                        <div
                            className="w-5 h-5 rounded"
                            style={{
                                backgroundColor:
                                    COLOR_MAP.month.false,
                            }}
                        ></div>
                        <div
                            className="w-5 h-5 rounded"
                            style={{
                                backgroundColor:
                                    COLOR_MAP.quarter.false,
                            }}
                        ></div>
                        <div
                            className="w-5 h-5 rounded"
                            style={{
                                backgroundColor:
                                    COLOR_MAP.half.false,
                            }}
                        ></div>
                    </span>
                </div>
                <h1 className="font-bold">
                    {monthIndex}월 진행상황
                </h1>
                <hr className="my-3 mb-5" />
                <div className="flex justify-between">
                    {tunnelList.map((tunnel) => {
                        const tunnelData =
                            data?.[tunnel]?.[
                                monthIndex - 1
                            ];
                        const monthTask =
                            tunnelData?.monthTask;

                        return (
                            <div
                                key={tunnel}
                                className="flex flex-col w-full"
                            >
                                <h2 className="text-center">
                                    {tunnel}
                                </h2>
                                {monthTask ? (
                                    <TaskStatusPieChart
                                        data={monthTask}
                                        taskType="month"
                                    />
                                ) : (
                                    <p>데이터 없음</p>
                                )}
                                <div className="text-base text-center">
                                    진행률:{" "}
                                    {Math.round(
                                        progressRate(
                                            monthTask
                                        ) * 100
                                    )}
                                    %
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="py-20 ">
                <h1 className="font-bold">분기 진행상황</h1>
                <hr className="my-3 mb-5" />
                <div className="flex justify-between">
                    {tunnelList.map((tunnel) => {
                        const correctedQuarterTask = data
                            ? getQuarterCorrectedTask(
                                  tunnel,
                                  monthIndex
                              )
                            : undefined;

                        return (
                            <div
                                key={tunnel}
                                className="flex flex-col w-full"
                            >
                                <h2 className="text-center">
                                    {tunnel}
                                </h2>
                                {correctedQuarterTask ? (
                                    <TaskStatusPieChart
                                        data={
                                            correctedQuarterTask
                                        }
                                        taskType="quarter"
                                    />
                                ) : (
                                    <p>데이터 없음</p>
                                )}
                                <div className="text-base text-center">
                                    진행률:{" "}
                                    {Math.round(
                                        progressRate(
                                            correctedQuarterTask
                                        ) * 100
                                    )}
                                    %
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            {/* 반기 */}
            <div className="py-20">
                <h1 className="font-bold">반기 진행상황</h1>
                <hr className="my-3 mb-5" />
                <div className="flex justify-between">
                    {tunnelList.map((tunnel) => {
                        const halfTask = data
                            ? getHalfCorrectedTask(
                                  tunnel,
                                  monthIndex
                              )
                            : undefined;

                        return (
                            <div
                                key={tunnel}
                                className="flex flex-col w-full"
                            >
                                <h2 className="text-center">
                                    {tunnel}
                                </h2>
                                {halfTask ? (
                                    <TaskStatusPieChart
                                        data={halfTask}
                                        taskType="half"
                                    />
                                ) : (
                                    <p>데이터 없음</p>
                                )}
                                <div className="text-base text-center">
                                    진행률:{" "}
                                    {Math.round(
                                        progressRate(
                                            halfTask
                                        ) * 100
                                    )}
                                    %
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
