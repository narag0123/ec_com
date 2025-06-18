"use client";

import { DocumentData } from "firebase/firestore";
import { tunnelList } from "../data/tunnelList";
import TaskStatusPieChart from "../../chart/taskPieChart";
import {
    getHalfCorrectedTask,
    getQuarterCorrectedTask,
    progressRate,
} from "@/app/service/progress-service";

interface Props {
    monthIndex: number;
    data: Record<string, DocumentData[]>;
}

export default function TodosHalf({
    monthIndex,
    data,
}: Props) {
    return (
        <div className="py-0">
            <h1 className="font-bold text-lg">
                반기 진행상황
            </h1>
            <hr className="my-3 mb-5" />
            <div className="flex justify-between">
                {tunnelList.map((tunnel) => {
                    const halfTask = data
                        ? getHalfCorrectedTask(
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
                            {halfTask ? (
                                <TaskStatusPieChart
                                    data={halfTask}
                                    taskType="half"
                                />
                            ) : (
                                <p></p>
                            )}
                            <div className="text-sm text-center">
                                진행률:{" "}
                                {Math.round(
                                    progressRate(halfTask) *
                                        100
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
