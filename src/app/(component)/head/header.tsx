"use client";

import { initData } from "@/app/service/firebase-data-service";
import { usePathname } from "next/navigation";

export const urlNameByTunnelList = (
    name: string
): string => {
    switch (name) {
        case "광장":
            return "GJ";
        case "화랑":
            return "HR";
        case "백현":
            return "BH";
        case "정자":
            return "JJ";
        case "성내미":
            return "SNM";
        case "소음저감":
            return "NR";

        default:
            return "알 수 없음";
    }
};

export default function Header() {
    const pathname: string[] = usePathname()
        .split("/")
        .filter(Boolean);

    const lastURL: string = pathname[pathname.length - 1];
    const tunnelList: string[] = [
        "광장",
        "화랑",
        "백현",
        "정자",
        "성내미",
        "소음저감",
    ];

    return (
        <div className="">
            <div className="flex justify-between pb-10">
                <div className="flex gap-10 items-center">
                    <a href="/" className="font-bold">
                        직무고시
                    </a>

                    {lastURL ? (
                        <button
                            className="flex items-center gap-3 border-black border-[1px] p-2 px-8 rounded-full shadow-md active:shadow-none"
                            onClick={() => {
                                const confirmed =
                                    window.confirm(
                                        "주의!! 현재 페이지의 모든 데이터가 초기화됩니다. 가능하면 1년에 한번만 초기화해 주세요. 정말 초기화하시겠습니까?"
                                    );
                                if (confirmed) {
                                    initData(lastURL).then(
                                        () => {
                                            window.location.reload();
                                        }
                                    );
                                }
                            }}
                        >
                            <img
                                className="w-[20px]"
                                src="/refresh.png"
                            />
                            <span className="text-base">
                                초기화
                            </span>
                        </button>
                    ) : (
                        <></>
                    )}
                </div>

                <div className="flex gap-3 items-end">
                    {tunnelList.map((e) => {
                        return (
                            <a
                                key={e}
                                className={`${
                                    urlNameByTunnelList(
                                        e
                                    ) === lastURL &&
                                    `font-bold text-[28px]`
                                } `}
                                href={urlNameByTunnelList(
                                    e
                                )}
                            >
                                {e}
                            </a>
                        );
                    })}
                </div>
            </div>
            {lastURL ? (
                <div className="flex">
                    <div className="basis-1/4">매월</div>
                    <div className="basis-1/4">분기</div>
                    <div className="basis-1/4">반기</div>
                    <div className="basis-1/4">
                        외부점검
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
