"use client";

import { DocumentData } from "firebase/firestore";
import { tunnelList } from "../data/tunnelList";
import TaskStatusPieChart from "../../chart/taskPieChart";
import {
    getQuarterCorrectedTask,
    progressRate,
} from "@/app/service/progress-service";

interface Props {
    monthIndex: number;
    data: Record<string, DocumentData[]>;
}

export default function TodosQuarter({
    monthIndex,
    data,
}: Props) {
    return (
        <div className="py-20 ">
            <h1 className="font-bold text-lg">
                분기 진행상황
            </h1>
            <hr className="my-3 mb-5" />
            <div className="flex justify-between">
                {tunnelList.map((tunnel) => {
                    const correctedQuarterTask = data
                        ? getQuarterCorrectedTask(
                              data,
                              tunnel,
                              monthIndex
                          )
                        : undefined;

                    return (
                        <div
                            key={tunnel}
                            className="flex flex-col w-full"
                        >
                            <h2 className="text-center text-base">
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
                                <p className="text-3xl">
                                    로딩중
                                </p>
                            )}
                            <div className="text-sm text-center">
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
    );
}
