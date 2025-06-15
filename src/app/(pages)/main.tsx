"use client";
import { getMonth } from "date-fns";

export default function Main_Page() {
    const date = new Date();
    const monthIndex: number = getMonth(date) + 1;
    const tunnelList: string[] = [
        "광장",
        "화랑",
        "백현",
        "정자",
        "성내미",
        "소음저감",
    ];

    return (
        <div>
            <div>
                <h1>{monthIndex}월</h1>
                <hr />
                <div className="flex justify-between">
                    {tunnelList.map((e, i) => {
                        return (
                            <div>
                                <h2>{e}</h2>
                                <div>진행률</div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div>
                <h1>분기 진행상황</h1>
                <hr />
            </div>
            <div>
                <h1>반기 진행상황</h1>
                <hr />
            </div>
        </div>
    );
}
