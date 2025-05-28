import { db } from "@/config/firebase-config";
import {
    collection,
    getDocs,
    updateDoc,
    doc,
    deleteDoc,
    setDoc,
    DocumentData,
    query,
    where,
} from "firebase/firestore";
import { useState } from "react";
import { EcState, TaskData } from "../(pages)/[id]/page";

export const getDataByName = async (
    tunnelName: string
): Promise<EcState> => {
    try {
        const collectionRef = collection(db, tunnelName);
        const snap = await getDocs(collectionRef);
        const data: EcState = {};

        snap.docs.forEach((docSnap) => {
            const month = parseInt(docSnap.id);
            const raw = docSnap.data();

            data[month] = {
                monthTask: raw.monthTask ?? {
                    power: false,
                    generator: false,
                    facility: false,
                },
                quarterTask: raw.quarterTask ?? {
                    thermal: false,
                },
                halfTask: raw.halfTask ?? {
                    ground: false,
                    light: false,
                },
                outsideTask: raw.outsideTask ?? false,
                safetySupervisor:
                    raw.safetySupervisor ?? "OOO",
            };
        });

        console.log(
            `✅ ${tunnelName} 컬렉션 가져오기 성공`
        );
        return data;
    } catch (error) {
        console.error(
            `❌ ${tunnelName} 문서 불러오기 실패:`,
            error
        );
        return {}; // 실패 시 빈 객체 반환
    }
};

/**
 * 데이터 구조 생성하는 함수. 1회용 또는 추가적으로 필요할떄 사용
 * */
export const createFirestoreStructure = async () => {
    const tunnelList = [
        "GJ",
        "HR",
        "BH",
        "JJ",
        "SNM",
        "NR",
    ];

    try {
        for (const tunnel of tunnelList) {
            for (let month = 1; month <= 12; month++) {
                const docId = `${month}`; // ex) "2025.3"
                const docRef = doc(db, tunnel, docId);

                await setDoc(docRef, {
                    monthTask: {
                        power: false,
                        generator: false,
                        facility: false,
                    },
                    quarterTask: {
                        thermal: false,
                    },
                    halfTask: {
                        ground: false,
                        light: false,
                    },
                    outsideTask: false,
                    safetySupervisor: "OOO",
                });

                console.log(
                    `✅ ${tunnel}/${docId} 문서 생성 완료`
                );
            }
        }

        console.log("🔥 모든 컬렉션/문서 생성 완료");
    } catch (error) {
        console.error("❌ 생성 중 오류 발생:", error);
    }
};

/**
 * 특정 월 데이터를 Firestore에 저장
 */
export const updateMonthData = async (
    tunnelName: string,
    month: number,
    newData: TaskData
): Promise<void> => {
    try {
        const ref = doc(db, tunnelName, String(month));
        await setDoc(ref, newData, { merge: true });
        console.log(
            `✅ Firestore에 ${tunnelName}/${month} 업데이트 완료`
        );
    } catch (error) {
        console.error(
            `❌ Firestore 업데이트 실패 (${tunnelName}/${month}):`,
            error
        );
    }
};

/**
 * Firestore의 특정 컬렉션(터널 이름)의 모든 월 데이터를 false로 초기화
 * @param tunnelId 예: 'GJ', 'HR', 'BH' 등
 */
export const initData = async (
    lastURL: string
): Promise<void> => {
    const defaultTaskData = {
        monthTask: {
            power: false,
            generator: false,
            facility: false,
        },
        quarterTask: {
            thermal: false,
        },
        halfTask: {
            ground: false,
            light: false,
        },
    };

    const resetFirestoreDataToFalse = async (
        tunnelId: string
    ) => {
        try {
            for (let month = 1; month <= 12; month++) {
                const ref = doc(
                    db,
                    tunnelId,
                    String(month)
                );
                await setDoc(ref, defaultTaskData, {
                    merge: true,
                });
                console.log(
                    `✅ ${tunnelId}/${month} 초기화 완료`
                );
            }
            console.log(`🔥 ${tunnelId} 전체 초기화 완료`);
        } catch (error) {
            console.error(
                `❌ ${tunnelId} 초기화 실패:`,
                error
            );
        }
    };

    resetFirestoreDataToFalse(lastURL);

    // const tunnels = ["GJ", "HR", "BH", "JJ", "SNM", "NR"];

    // for (const tunnel of tunnels) {
    //     await resetFirestoreDataToFalse(tunnel);
    // }

    console.log(`🚨${lastURL} 터널 초기화 완료`);
};
