// components/TaskStatusPieChart.tsx
"use client";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { COLOR_MAP } from "./colorMap";

type TaskStatusData = {
    name: string;
    value: number;
    status: "true" | "false";
};

type Props = {
    data: Record<string, boolean>; // 예: monthTask, halfTask 등
    taskType: "month" | "quarter" | "half";
};

export default function TaskStatusPieChart({
    data,
    taskType,
}: Props) {
    const pieData: TaskStatusData[] = Object.entries(
        data
    ).map(([key, value]) => ({
        name: key,
        value: 1,
        status: value ? "true" : "false",
    }));

    const nameTransformer = (name: string) => {
        switch (name) {
            case "facility":
                return "시설물";
            case "generator":
                return "발전기";
            case "power":
                return "전력";
            case "ups":
                return "UPS";

            case "thermal":
                return "열화상";
            case "light":
                return "조도측정";
            case "ground":
                return "접지저항";
            default:
                return "알 수 없는 라벨";
        }
    };

    return (
        <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                    <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        // label
                    >
                        {pieData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={
                                    COLOR_MAP[taskType][
                                        entry.status
                                    ]
                                }
                            />
                        ))}
                    </Pie>
                    <Tooltip
                        content={({ active, payload }) => {
                            if (
                                active &&
                                payload &&
                                payload.length > 0
                            ) {
                                const { name, status } =
                                    payload[0].payload;

                                return (
                                    <div className="bg-white border p-2 rounded shadow text-sm">
                                        <strong>
                                            {nameTransformer(
                                                name
                                            )}
                                        </strong>
                                        :{" "}
                                        {status ===
                                        "true" ? (
                                            <span>
                                                완료 ✅
                                            </span>
                                        ) : (
                                            <span>
                                                미완료 🚫
                                            </span>
                                        )}
                                    </div>
                                );
                            }
                            return null;
                        }}
                    />
                    {/* <Legend /> */}
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
