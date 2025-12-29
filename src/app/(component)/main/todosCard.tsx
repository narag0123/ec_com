"use client";
import { useEffect, useState } from "react";
import ToggleSwitch from "../btn/toggle";
import { format } from "date-fns";
import { EcState, TaskData } from "@/app/(pages)/[id]/page";

interface MonthType {
    month: number;
}

type ObjectSectionKeys = {
    [K in keyof TaskData]: TaskData[K] extends object
        ? K
        : never;
}[keyof TaskData];

type Props = {
    month: number;
    data?: TaskData;
    allData: EcState;
    onChange?: (newData: TaskData) => void;
    onUpdateSupervisorFromMonth?: (
        from: number,
        name: string
    ) => void;
    isDisableUPS?: boolean;
};

export default function TodosCard({
    month,
    data,
    allData,
    onChange,
    onUpdateSupervisorFromMonth,
    isDisableUPS,
}: Props) {
    const [status, setStatus] = useState<TaskData>(
        data ?? {
            monthTask: {
                power: false,
                generator: false,
                facility: false,
                ups: false,
            },
            quarterTask: { thermal: false },
            halfTask: { ground: false, light: false },
            outsideTask: false,
            safetySupervisor: "",
        }
    );

    const [showInput, setShowInput] = useState(false);
    const [newSupervisor, setNewSupervisor] = useState("");

    useEffect(() => {
        if (data) setStatus(data);
    }, [data]);

    // 🔍 외부점검 상태 기반으로 특정 항목 disabled할지 결정
    const isDisabledByOutside = (
        section: keyof TaskData,
        key: keyof TaskData[keyof TaskData]
    ): boolean => {
        if (!status.outsideTask) return false;

        const quarter =
            month <= 3
                ? [1, 2, 3]
                : month <= 6
                ? [4, 5, 6]
                : month <= 9
                ? [7, 8, 9]
                : [10, 11, 12];

        const half =
            month <= 6
                ? [1, 2, 3, 4, 5, 6]
                : [7, 8, 9, 10, 11, 12];

        // 열화상은 분기 내에서
        if (
            section === "quarterTask" &&
            key === "thermal" &&
            quarter.includes(month)
        ) {
            return true;
        }

        // 접지저항은 반기 내에서
        if (
            section === "halfTask" &&
            key === "ground" &&
            half.includes(month)
        ) {
            return true;
        }

        return false;
    };

    const isOutsideTaskDisabled = (
        month: number
    ): boolean => {
        return Object.entries(allData).some(
            ([m, data]) =>
                parseInt(m) !== month &&
                data.outsideTask === true
        );
    };

    const isOtherTrueInPeriod = <
        Section extends keyof TaskData,
        Field extends keyof TaskData[Section]
    >(
        period: "quarter" | "half",
        section: Section,
        key: Field
    ): boolean => {
        const getRange = (
            type: "quarter" | "half",
            month: number
        ): number[] => {
            if (type === "quarter") {
                if (month <= 3) return [1, 2, 3];
                if (month <= 6) return [4, 5, 6];
                if (month <= 9) return [7, 8, 9];
                return [10, 11, 12];
            } else {
                return month <= 6
                    ? [1, 2, 3, 4, 5, 6]
                    : [7, 8, 9, 10, 11, 12];
            }
        };

        const range = getRange(period, month);

        return range.some(
            (m) =>
                m !== month &&
                allData[m]?.[section]?.[key] === true
        );
    };

    // ✅ 해당 월의 분기 반환
    const getQuarterRange = (month: number): number[] => {
        if (month <= 3) return [1, 2, 3];
        if (month <= 6) return [4, 5, 6];
        if (month <= 9) return [7, 8, 9];
        return [10, 11, 12];
    };

    // ✅ 해당 월의 반기 반환
    const getHalfRange = (month: number): number[] =>
        month <= 6
            ? [1, 2, 3, 4, 5, 6]
            : [7, 8, 9, 10, 11, 12];

    // ✅ 외부점검 true 기준으로 열화상, 접지저항 비활성화 판단
    const isDisabledByOutsideOrOthers = <
        Section extends keyof TaskData,
        Key extends Section extends ObjectSectionKeys
            ? keyof TaskData[Section]
            : never
    >(
        section: Section,
        key: Key
    ): boolean => {
        const quarter = getQuarterRange(month);
        const half = getHalfRange(month);

        // ✅ 외부점검: 다른 달에 true 있으면 disabled
        if (section === "outsideTask") {
            return Object.entries(allData).some(
                ([m, data]) =>
                    parseInt(m) !== month &&
                    data.outsideTask === true
            );
        }

        // ✅ 열화상: 외부점검 true가 분기 내 있으면 disabled
        if (
            section === "quarterTask" &&
            key === "thermal"
        ) {
            return quarter.some(
                (m) => allData[m]?.outsideTask === true
            );
        }

        // ✅ 접지저항: 외부점검 true가 반기 내 있으면 disabled
        if (section === "halfTask" && key === "ground") {
            return half.some(
                (m) => allData[m]?.outsideTask === true
            );
        }

        return false;
    };
    // ✅ 객체 항목용 토글 핸들러 (기존과 동일)
    const handleChange = <
        Section extends ObjectSectionKeys,
        Key extends keyof TaskData[Section]
    >(
        section: Section,
        key: Key
    ) => {
        return (value: boolean) => {
            const updated: TaskData = {
                ...status,
                [section]: {
                    ...status[section],
                    [key]: value,
                },
            };
            setStatus(updated);
            onChange?.(updated);
        };
    };

    // ✅ outsideTask 전용 핸들러
    const handleOutsideToggle = (value: boolean) => {
        const updated: TaskData = {
            ...status,
            outsideTask: value,
        };
        setStatus(updated);
        onChange?.(updated);
    };

    const nowDate: number = parseInt(
        format(new Date(), "dd")
    );

    const handleSupervisorChange = () => {
        if (!newSupervisor.trim()) return;

        onUpdateSupervisorFromMonth?.(month, newSupervisor);
        setShowInput(false);
    };
    // console.log(status); firebase에 이거올리면됨

    return (
        <div className="py-3 mb-3">
            <div className="flex  mb-3">
                <div className="basis-1/4 flex items-end gap-5">
                    <div className="text-2xl">
                        {month}월
                    </div>
                    {showInput ? (
                        <div className="px-3 py-1 border-black border-[1px] rounded-full">
                            <input
                                type="text"
                                value={newSupervisor}
                                onChange={(e) =>
                                    setNewSupervisor(
                                        e.target.value
                                    )
                                }
                                placeholder="이름을 입력하세요"
                                className="text-sm rounded px-1 py-0.5"
                            />
                            <button
                                onClick={
                                    handleSupervisorChange
                                }
                                className="text-sm text-blue-500"
                            >
                                확인
                            </button>
                        </div>
                    ) : (
                        <button
                            className="text-sm  px-3 py-1 border-black border-[1px] rounded-full"
                            onClick={() =>
                                setShowInput(true)
                            }
                        >
                            안전관리자:{" "}
                            {status.safetySupervisor || ""}
                        </button>
                    )}
                </div>
            </div>
            {/* 매월 */}
            <div className="flex">
                <div className="basis-1/4 flex gap-8">
                    <ToggleSwitch
                        checked={status.monthTask.power}
                        label="일지류"
                        onChange={handleChange(
                            "monthTask",
                            "power"
                        )}
                        month={month}
                    />

                    <ToggleSwitch
                        checked={status.monthTask.generator}
                        label="표지"
                        onChange={handleChange(
                            "monthTask",
                            "generator"
                        )}
                        month={month}
                    />
                    <ToggleSwitch
                        checked={status.monthTask.facility}
                        label="사진대지"
                        onChange={handleChange(
                            "monthTask",
                            "facility"
                        )}
                        month={month}
                    />
                    <ToggleSwitch
                        checked={status.monthTask.ups}
                        label="UPS"
                        onChange={handleChange(
                            "monthTask",
                            "ups"
                        )}
                        disabled={isDisableUPS}
                        month={month}
                    />
                </div>
                {/* 분기 */}
                <div className="basis-1/4 ">
                    <ToggleSwitch
                        checked={status.quarterTask.thermal}
                        label="열화상"
                        onChange={handleChange(
                            "quarterTask",
                            "thermal"
                        )}
                        month={month}
                        disabled={
                            isOtherTrueInPeriod(
                                "quarter",
                                "quarterTask",
                                "thermal"
                            ) ||
                            isDisabledByOutsideOrOthers(
                                "quarterTask",
                                "thermal"
                            )
                        }
                    />
                </div>
                {/* 반기 */}
                <div className="basis-1/4 flex gap-8">
                    {/* <ToggleSwitch
                        checked={status.halfTask.ground}
                        label="접지저항"
                        onChange={handleChange(
                            "halfTask",
                            "ground"
                        )}
                        month={month}
                        disabled={
                            isOtherTrueInPeriod(
                                "half",
                                "halfTask",
                                "ground"
                            ) ||
                            isDisabledByOutsideOrOthers(
                                "halfTask",
                                "ground"
                            )
                        }
                    /> */}
                    <ToggleSwitch
                        checked={status.halfTask.light}
                        label="조도측정"
                        onChange={handleChange(
                            "halfTask",
                            "light"
                        )}
                        month={month}
                        disabled={
                            isOtherTrueInPeriod(
                                "half",
                                "halfTask",
                                "light"
                            ) ||
                            isDisabledByOutsideOrOthers(
                                "halfTask",
                                "light"
                            )
                        }
                    />
                </div>
                <div className="basis-1/4 flex gap-8">
                    <ToggleSwitch
                        checked={status.outsideTask}
                        label="외부점검"
                        onChange={handleOutsideToggle}
                        month={month}
                        disabled={isDisabledByOutsideOrOthers(
                            "outsideTask",
                            undefined as never
                        )}
                    />
                </div>
            </div>
            {month % 3 == 0 && (
                <hr className="border-b-black border-b-[0.5px] mt-10" />
            )}
        </div>
    );
}
