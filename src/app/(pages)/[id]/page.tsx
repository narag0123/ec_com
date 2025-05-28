"use client";
import TodosCard from "@/app/(component)/main/todosCard";
import {
    getDataByName,
    updateMonthData,
    // createFirestoreStructure,
} from "@/app/service/firebase-data-service";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface EcStateType {
    monthTask: {
        power: boolean;
        generator: boolean;
        facility: boolean;
    };
    quarterTask: {
        thermal: boolean;
    };
    halfTask: {
        ground: boolean;
        light: boolean;
    };
}

export interface TaskData {
    monthTask: {
        power: boolean;
        generator: boolean;
        facility: boolean;
    };
    quarterTask: { thermal: boolean };
    halfTask: { ground: boolean; light: boolean };
}

export interface EcState {
    [month: number]: TaskData;
}

export default function page() {
    const params = useParams();
    const id = params.id as string;
    const [ecState, setEcState] = useState<EcState>({});

    useEffect(() => {
        const fetchData = async () => {
            const result = await getDataByName(id);
            setEcState(result); // 여기서 상태 업데이트
            console.log(`${id} 데이터`, result);
        };

        fetchData();
    }, []);

    const handleChange = async (
        month: number,
        newData: TaskData
    ) => {
        setEcState((prev) => ({
            ...prev,
            [month]: newData,
        }));
        await updateMonthData(id, month, newData);
    };

    return (
        <div>
            {/* <button
                onClick={() => {
                    createFirestoreStructure();
                }}
            >
                데이터 생성
            </button> */}
            {Array.from(
                { length: 12 },
                (_, i) => i + 1
            ).map((month) => (
                <TodosCard
                    key={month}
                    month={month}
                    data={ecState[month]}
                    allData={ecState}
                    onChange={(updated) =>
                        handleChange(month, updated)
                    }
                />
            ))}
        </div>
    );
}
