"use client";
import { se } from "date-fns/locale";
import React, { useEffect, useState } from "react";
function Notice() {
    const [togglePopUp, setTogglePopUp] =
        useState<boolean>(false);

    useEffect(() => {
        const hidden = localStorage.getItem("noticeHidden");
        if (hidden === "false" || hidden == null) {
            setTogglePopUp(true);
        }
    }, []);

    if (togglePopUp === false || togglePopUp === null) {
        return null;
    }

    return (
        <div
            className={`absolute p-5 text-base gap-5 top-1/2 left-1/2 z-50 
            flex flex-col justify-between translate-x-[-50%] translate-y-[-50%]
            w-[50dvw] h-[50dvh] bg-slate-50 border-black border-[2px] rounded-md`}
        >
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3">
                    <h1 className="text-2xl font-bold ">
                        1. 접지저항 항목 삭제
                    </h1>
                    <div>
                        접지저항 항목이 제거되었습니다
                    </div>
                    <div>
                        점검시 뇌우가 발생할 경우 점검자
                        안전이 우려되어 삭제 되었습니다.
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <h1 className="text-2xl font-bold mt-5">
                        2. 조도측정 사진 추가
                    </h1>
                    <div>
                        조도측정 하는경우 사진대지에
                        추가해주시기 바랍니다
                    </div>
                </div>
            </div>
            <div className="w-full flex gap-3">
                <button
                    className="px-10 py-3 w-1/2 bg-black rounded-md text-white"
                    onClick={() => {
                        setTogglePopUp(false);
                    }}
                >
                    닫기
                </button>
                <button
                    className="px-10 py-3 w-1/2 bg-blue-500 rounded-md text-white"
                    onClick={() => {
                        localStorage.setItem(
                            "noticeHidden",
                            "true"
                        );
                        setTogglePopUp(false);
                    }}
                >
                    앞으로 안보기
                </button>
            </div>
        </div>
    );
}

export default Notice;
