"use client";
import { getMonth } from "date-fns";
import { useEffect, useState } from "react";
import { getAllData } from "../service/firebase-data-service";
import { DocumentData } from "firebase/firestore";
import TaskStatusPieChart from "../(component)/chart/taskPieChart";
import { COLOR_MAP } from "../(component)/chart/colorMap";
import { tunnelList } from "../(component)/main/data/tunnelList";
import {
    getHalfCorrectedTask,
    getQuarterCorrectedTask,
    progressRate,
} from "../service/progress-service";
import TodosMonthly from "../(component)/main/sub-todos/todos-monthly";
import TodosQuarter from "../(component)/main/sub-todos/todos-quarter";
import TodosHalf from "../(component)/main/sub-todos/todos-half";
import ColorChipCard from "../(component)/main/colorChipCard";

export interface OutsideAdjustmentMap {
    quarter: Set<number>; // 0 ~ 3
    half: Set<number>; // 0 ~ 1
}

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

    return (
        <div>
            <div>
                <ColorChipCard />
                {data && (
                    <>
                        <TodosMonthly
                            monthIndex={monthIndex}
                            data={data}
                        />
                        <TodosQuarter
                            monthIndex={monthIndex}
                            data={data}
                        />
                        <TodosHalf
                            monthIndex={monthIndex}
                            data={data}
                        />
                    </>
                )}
            </div>

            {/* 반기 */}
        </div>
    );
}
