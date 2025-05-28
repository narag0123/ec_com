"use client";
import { useEffect, useState } from "react";
import ToggleSwitch from "../btn/toggle";
import { format } from "date-fns";
import { EcState, TaskData } from "@/app/(pages)/[id]/page";

interface MonthType {
    month: number;
}

type Props = {
    month: number;
    data?: TaskData;
    allData: EcState;
    onChange?: (newData: TaskData) => void;
};

export default function TodosCard({
    month,
    data,
    allData,
    onChange,
}: Props) {
    const [status, setStatus] = useState<TaskData>(
        data ?? {
            monthTask: {
                power: false,
                generator: false,
                facility: false,
            },
            quarterTask: { thermal: false },
            halfTask: { ground: false, light: false },
        }
    );

    useEffect(() => {
        if (data) setStatus(data);
    }, [data]);

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

    const handleChange =
        (section: keyof TaskData, key: string) =>
        (value: boolean) => {
            const updated = {
                ...status,
                [section]: {
                    ...status[section],
                    [key]: value,
                },
            };
            setStatus(updated);
            onChange?.(updated); // 부모에게 전달
        };

    const nowDate: number = parseInt(
        format(new Date(), "dd")
    );

    // console.log(status); firebase에 이거올리면됨

    return (
        <div className="py-3 mb-3">
            <div className="flex  mb-3">
                <div className="basis-1/4 flex items-end gap-5">
                    <span>{month}월</span>
                    {Object.values(status.monthTask).every(
                        Boolean
                    ) ? (
                        <span className="text-sm">
                            완료날짜: {nowDate}일
                        </span>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="basis-1/4 text-sm flex items-end">
                    {Object.values(
                        status.quarterTask
                    ).every(Boolean) ? (
                        <span className="text-sm">
                            완료날짜: {nowDate}일
                        </span>
                    ) : (
                        <></>
                    )}
                </div>
                <div className="basis-1/4 text-sm flex items-end">
                    {Object.values(status.halfTask).every(
                        Boolean
                    ) ? (
                        <span className="text-sm">
                            완료날짜: {nowDate}일
                        </span>
                    ) : (
                        <></>
                    )}
                </div>
            </div>
            {/* 매월 */}
            <div className="flex">
                <div className="basis-1/4 flex gap-8">
                    <ToggleSwitch
                        checked={status.monthTask.power}
                        label="전력일지"
                        onChange={handleChange(
                            "monthTask",
                            "power"
                        )}
                        month={month}
                    />

                    <ToggleSwitch
                        checked={status.monthTask.generator}
                        label="발전기일지"
                        onChange={handleChange(
                            "monthTask",
                            "generator"
                        )}
                        month={month}
                    />
                    <ToggleSwitch
                        checked={status.monthTask.facility}
                        label="시설물일지"
                        onChange={handleChange(
                            "monthTask",
                            "facility"
                        )}
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
                        disabled={isOtherTrueInPeriod(
                            "quarter",
                            "quarterTask",
                            "thermal"
                        )}
                    />
                </div>
                {/* 반기 */}
                <div className="basis-1/4 flex gap-8">
                    <ToggleSwitch
                        checked={status.halfTask.ground}
                        label="접지저항"
                        onChange={handleChange(
                            "halfTask",
                            "ground"
                        )}
                        month={month}
                        disabled={isOtherTrueInPeriod(
                            "half",
                            "halfTask",
                            "ground"
                        )}
                    />
                    <ToggleSwitch
                        checked={status.halfTask.light}
                        label="조도측정"
                        onChange={handleChange(
                            "halfTask",
                            "light"
                        )}
                        month={month}
                        disabled={isOtherTrueInPeriod(
                            "half",
                            "halfTask",
                            "light"
                        )}
                    />
                </div>

                <div className="basis-1/4 flex gap-8">
                    <ToggleSwitch
                        checked={status.halfTask.ground}
                        label="외부점검"
                        onChange={handleChange(
                            "halfTask",
                            "ground"
                        )}
                        month={month}
                        disabled={isOtherTrueInPeriod(
                            "half",
                            "halfTask",
                            "ground"
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
