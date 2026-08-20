import type { Metadata } from "next";import QuizClient from "./QuizClient";
export const metadata:Metadata={title:"Quiz | Maxwell Young",description:"A sourced, replayable Maxwell Young discography quiz."};
export default function QuizPage(){return <QuizClient/>}
