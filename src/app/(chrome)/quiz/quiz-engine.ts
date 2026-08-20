import type { Question, Source } from "./quiz-data";
export type Mode = "quick" | "deep" | "full";
export const modeSize: Record<Mode, number> = { quick: 10, deep: 15, full: 60 };
export function shuffle<T>(items:T[], random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j]!,a[i]!]}return a}
export function selectQuestions(all:Question[],mode:Mode,random=Math.random){const pool=mode==="deep"?all.filter(x=>x.difficulty>=2):all;return shuffle(pool,random).slice(0,Math.min(modeSize[mode],pool.length));}
export type Game={score:number;streak:number;lives:number;correct:number;answered:number};
export const initialGame:Game={score:0,streak:0,lives:3,correct:0,answered:0};
export function answer(game:Game,correct:boolean,difficulty:number,risk=false):Game{if(!correct)return {...game,streak:0,lives:Math.max(0,game.lives-(risk?2:1)),answered:game.answered+1};const streak=game.streak+1;const multiplier=(risk?2:1)*(streak>=5?2:streak>=3?1.5:1);return {...game,streak,score:game.score+Math.round(100*difficulty*multiplier),correct:game.correct+1,answered:game.answered+1};}
export function validateSources(q:Question[],s:Source[]){const ids=new Set(s.map(x=>x.id));return q.every(x=>x.options.length===4&&x.answer>=0&&x.answer<4&&ids.has(x.sourceId))&&s.every(x=>{try{return Boolean(x.snippet&&x.published&&x.accessed&&new URL(x.url).protocol==="https:")}catch{return false}})}
export function achievements(g:Game){return [g.correct>=5&&"First five",g.streak>=5&&"On repeat",g.correct>=25&&"Liner notes",g.lives===3&&g.answered>=10&&"Untouched"].filter(Boolean) as string[]}
export function identity(percent:number){return percent>=90?"Master Tape":percent>=70?"Release-Day Regular":percent>=45?"Bedroom Pop Archivist":"Fresh Ears"}
