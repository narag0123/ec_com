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
    getDoc,
} from "firebase/firestore";
import { useState } from "react";
import {
    EcState,
    EcStateType,
    TaskData,
} from "../(pages)/[id]/page";
import { urlNameByTunnelList } from "../(component)/head/header";

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
                    ups: false,
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
                        ups: false,
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
 * Firestore의 특정 컬렉션(터널 이름)의 모든 월 데이터를 완전히 초기화
 * @param tunnelId 예: 'GJ', 'HR', 'BH' 등
 */
export const initData = async (
    tunnelId: string
): Promise<void> => {
    try {
        for (let month = 1; month <= 12; month++) {
            const ref = doc(db, tunnelId, String(month));

            const resetData = {
                monthTask: {
                    power: false,
                    generator: false,
                    facility: false,
                    ups: false,
                },
                quarterTask: {
                    thermal: false,
                },
                halfTask: {
                    ground: false,
                    light: false,
                },
                outsideTask: false,
                safetySupervisor: "OOO", // 기본 이름으로 초기화
            };

            await setDoc(ref, resetData, { merge: false }); // 완전 덮어쓰기

            console.log(
                `✅ ${tunnelId}/${month} 초기화 완료`
            );
        }

        console.log(`🔥 ${tunnelId} 전체 초기화 완료`);
    } catch (error) {
        console.error(`❌ ${tunnelId} 초기화 실패:`, error);
    }
};

export const getAllData = async (
    tunnelList: string[]
): Promise<Record<string, EcStateType[]>> => {
    const result: Record<string, EcStateType[]> = {};

    for (const tunnel of tunnelList) {
        const param = urlNameByTunnelList(tunnel);

        try {
            const colRef = collection(db, param);
            const snap = await getDocs(colRef);

            const data = snap.docs
                .sort((a, b) => Number(a.id) - Number(b.id))
                .map((doc) => doc.data() as EcStateType);

            result[tunnel] = data;
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    return result;
};
