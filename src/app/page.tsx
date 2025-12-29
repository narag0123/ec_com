import Image from "next/image";
import Header from "./(component)/head/header";
import TodosCard from "./(component)/main/todosCard";
import React from "react";
import Main_Page from "./(pages)/main";
import Notice from "./(component)/notice/notice";

export default function Home() {
    return (
        <div className="text-[24px] py-10 font-square overflow-x-auto">
            <main>
                <Notice />
                <Main_Page />
            </main>
        </div>
    );
}
