"use client";

import { useEffect, useState } from "react";

type ToggleSwitchProps = {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
    month: number;
    disabled?: boolean;
};

export default function ToggleSwitch({
    checked = false,
    onChange,
    label,
    month,
    disabled = false,
}: ToggleSwitchProps) {
    const [enabled, setEnabled] = useState(checked);

    const handleToggle = () => {
        const newValue = !enabled;
        setEnabled(newValue);
        onChange?.(newValue);
    };

    // ✅ 외부 checked prop이 바뀌면 내부 상태도 동기화
    useEffect(() => {
        setEnabled(checked);
    }, [checked]);

    return (
        <div className="flex flex-col items-start gap-2">
            {label && (
                <span
                    className={`text-sm ${
                        disabled ? "opacity-30" : ""
                    }`}
                >
                    {label}
                </span>
            )}
            <button
                onClick={handleToggle}
                role="switch"
                aria-checked={enabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                    enabled ? "bg-blue-600" : "bg-gray-300"
                } ${disabled ? "opacity-30 " : ""}`}
                disabled={disabled}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                        enabled
                            ? "translate-x-5"
                            : "translate-x-1"
                    }`}
                />
            </button>
        </div>
    );
}
