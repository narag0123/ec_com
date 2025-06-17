"use client";
import TodosCard from "@/app/(component)/main/todosCard";
import {
    createFirestoreStructure,
    getDataByName,
    updateMonthData,
    // createFirestoreStructure,
} from "@/app/service/firebase-data-service";
import { db } from "@/config/firebase-config";
import { doc, setDoc } from "firebase/firestore";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export interface EcStateType {
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
    outsideTask: boolean;
    safetySupervisor: string;
}

export interface TaskData {
    monthTask: {
        power: boolean;
        generator: boolean;
        facility: boolean;
    };
    quarterTask: { thermal: boolean };
    halfTask: { ground: boolean; light: boolean };
    outsideTask: boolean;
    safetySupervisor: string;
}

export interface EcState {
    [month: number]: TaskData;
}

export default function page() {
    const params = useParams();
    const id = params.id as string;
    const [ecState, setEcState] = useState<EcState>({});

    // ✅ 특정 월부터 12월까지 이름 업데이트
    const updateSupervisorFromMonth = (
        fromMonth: number,
        name: string
    ) => {
        const updatedState = { ...ecState };

        for (let m = fromMonth; m <= 12; m++) {
            if (updatedState[m]) {
                updatedState[m] = {
                    ...updatedState[m],
                    safetySupervisor: name,
                };

                // 🔥 Firebase 업데이트
                const docRef = doc(db, id, `${m}`);
                setDoc(
                    docRef,
                    { safetySupervisor: name },
                    { merge: true }
                );
            }
        }

        setEcState(updatedState);
    };

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
                    onUpdateSupervisorFromMonth={
                        updateSupervisorFromMonth
                    }
                />
            ))}
        </div>
    );
}
