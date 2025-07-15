"use client";

import { DocumentData } from "firebase/firestore";
import { tunnelList } from "../data/tunnelList";
import TaskStatusPieChart from "../../chart/taskPieChart";
import { progressRate } from "@/app/service/progress-service";

interface Props {
    monthIndex: number;
    data: Record<string, DocumentData[]>;
}

export default function TodosMonthly({
    monthIndex,
    data,
}: Props) {
    return (
        <div className="">
            <div className="flex gap-3">
                <h1 className="font-bold text-lg">
                    {monthIndex}월 진행상황
                </h1>
                {/* <span className="text-lg">토글임</span> */}
            </div>
            <hr className="my-3 mb-5" />
            <div className="flex justify-between">
                {tunnelList.map((tunnel) => {
                    const tunnelData =
                        data?.[tunnel]?.[monthIndex - 1];
                    const monthTask = tunnelData?.monthTask;

                    return (
                        <div
                            key={tunnel}
                            className="flex flex-col justify-end w-full "
                        >
                            <h2 className="text-center text-base">
                                {tunnel}
                            </h2>

                            <TaskStatusPieChart
                                data={monthTask}
                                taskType="month"
                            />

                            <div className="text-center text-sm">
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
    );
}
