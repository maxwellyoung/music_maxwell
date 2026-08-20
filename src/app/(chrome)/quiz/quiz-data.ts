import releases from "../../../data/releases.ts";

export type Category = "Origins" | "Songs" | "Collaborators" | "Visuals" | "Interviews" | "Deep Cuts" | "Current Canon" | "Covers";
export type Difficulty = 1 | 2 | 3;
export type Source = { id: string; title: string; url: string; type: "interview" | "public-radio" | "Bandcamp" | "official-catalog"; published: string; accessed: string; confidence: "high"; snippet: string };
export type Question = { id: string; category: Category; difficulty: Difficulty; prompt: string; options: string[]; answer: number; explanation: string; sourceId: string; artwork?: string };

export const sources: Source[] = [
 {id:"cdm19",title:"Interview: Maxwell Young on No. 5",url:"https://www.coupdemainmagazine.com/maxwell-young/16163",type:"interview",published:"2019-11-08",accessed:"2026-07-21",confidence:"high",snippet:"Young says he makes music every day, calls completed songs happy accidents, says writing comes first, describes visuals as an extension, cites movies as inspiration, and discusses garage, SoundCloud, Clairo, Lontalius and Instupendo."},
 {id:"cdm-sod",title:"Interview: Sketches Of Dragonflies and plans for 2019",url:"https://www.coupdemainmagazine.com/nz-on-air/15375",type:"interview",published:"2019-03-08",accessed:"2026-07-21",confidence:"high",snippet:"The article calls Sketches Of Dragonflies a vulnerable reflection on maladaptive daydreaming, notes a move from Wellington to Auckland and an opening slot for Snail Mail. Young says honesty is central and Max Pirrit made the new artwork."},
 {id:"rngldr",title:"An Interview with Maxwell Young",url:"https://rngldr.wixsite.com/rngldr-magazine/maxwellyoung",type:"interview",published:"2019-05-15",accessed:"2026-07-21",confidence:"high",snippet:"Young says American Boyfriend inspired Daydreamer's bildungsroman approach, calls it a teenage diary, describes Only Romantics as a vignette, names Iridescence and Instupendo as influences, and recounts sending Casey Neistat a beat after a friend's suggestion."},
 {id:"rnz",title:"Introducing: Maxwell Young",url:"https://www.rnz.co.nz/national/programmes/introducing/audio/2018626583/introducing-maxwell-young",type:"public-radio",published:"2017-12-16",accessed:"2026-07-21",confidence:"high",snippet:"RNZ identifies the project and real name as Maxwell Young, hometown Wellington, associated acts Clairo and Lontalius, guilty pleasure Taylor Swift, and featured song Midnight."},
 {id:"bandcamp-or",title:"Only Romantics",url:"https://maxwellyoung.bandcamp.com/album/only-romantics",type:"Bandcamp",published:"2019-05-15",accessed:"2026-07-21",confidence:"high",snippet:"The public album page lists six tracks, release date May 15 2019, Maxwell as writer, producer, recorder, mixer and performer, artwork by Max Pirrit and Ilena Shadbolt, and detailed guest credits."},
 {id:"official",title:"Maxwell Young official release catalog",url:"https://www.maxwellyoung.info/",type:"official-catalog",published:"2026-04-30",accessed:"2026-07-21",confidence:"high",snippet:"The official release field lists Sneakin Drinks Into Bars, Flying, Wintour, Turn It Up, Freewheelin', I Just Wanna Fly, Hopeless and other releases with artwork and credits."}
];

const q=(id:string,category:Category,difficulty:Difficulty,prompt:string,options:string[],answer:number,explanation:string,sourceId:string):Question=>({id,category,difficulty,prompt,options,answer,explanation,sourceId});
export const questions: Question[] = [
q("home","Origins",1,"Which hometown did RNZ list for Maxwell Young?",["Wellington","Auckland","Dunedin","Christchurch"],0,"RNZ listed Wellington as his hometown.","rnz"),
q("rnz-song","Songs",1,"Which song did Maxwell introduce on RNZ in 2017?",["Midnight","No. 5","Wintour","Flying"],0,"The RNZ segment featured Midnight.","rnz"),
q("guilty","Interviews",2,"What did the RNZ profile list as his musical guilty pleasure?",["Taylor Swift","Radiohead","Prince","The Beatles"],0,"The short RNZ profile names Taylor Swift.","rnz"),
q("acts","Collaborators",1,"Which pair did RNZ list as associated acts?",["Clairo and Lontalius","Lorde and BENEE","Thom Haha and Dijon","Snail Mail and Burial"],0,"RNZ listed Clairo and Lontalius.","rnz"),
q("process","Interviews",1,"How did Maxwell describe songs that reach completion?",["Happy accidents","Strict exercises","Label assignments","Live improvisations"],0,"He called them happy accidents that he capitalised on feeling something from.","cdm19"),
q("daily","Interviews",1,"How often did Maxwell say he made music in the 2019 interview?",["Every day","Every Friday","Only on tour","Once a month"],0,"He said, 'I make music every day.'","cdm19"),
q("priority","Interviews",2,"What did Maxwell say comes first for him?",["Writing","Touring","Merchandise","Photography"],0,"Even with a stronger live band, he said writing comes first.","cdm19"),
q("visual-extension","Visuals",1,"How did he describe visuals in relation to the music?",["An extension of it","A separate business","Only decoration","A label decision"],0,"He said visuals and creative direction are an extension of the music.","cdm19"),
q("movie","Interviews",2,"Which medium did Maxwell call fantastic for songwriting?",["Movies","Sculpture","Dance reviews","Architecture"],0,"He praised movies for combining visuals, narrative and sound.","cdm19"),
q("garage","Deep Cuts",3,"Which genre did he say he had been interpreting into his music after Only Romantics?",["Garage","Opera","Bluegrass","Ska"],0,"The 2019 Coup de Main interview specifically mentions garage.","cdm19"),
q("soundcloud-age","Origins",3,"At what age did he say he listened to SoundCloud as much as iTunes?",["Twelve","Six","Eighteen","Twenty-one"],0,"He described SoundCloud and iTunes as equally important when he was twelve.","cdm19"),
q("no5-meaning","Songs",2,"How did Maxwell describe No. 5?",["Self-doubting, with false hope","A dance-floor victory lap","A travel diary","A protest song"],0,"He called it self-doubting and an admission of false hope.","cdm19"),
q("shining","Deep Cuts",3,"Which film character did Maxwell invoke while explaining a No. 5 lyric?",["Jack Torrance","Truman Burbank","Rocky Balboa","Ferris Bueller"],0,"He compared endless isolated work to Jack Torrance in The Shining.","cdm19"),
q("sod-theme","Songs",1,"Sketches Of Dragonflies was described as a reflection on what?",["Maladaptive daydreaming","Tour fatigue","Fashion","Night driving"],0,"Coup de Main called it a vulnerable reflection on maladaptive daydreaming.","cdm-sod"),
q("sod-shape","Songs",2,"How did Maxwell say Sketches Of Dragonflies begins?",["Melancholy and dreamlike","With a drum solo","As spoken word","Bright and triumphant"],0,"He said it starts melancholy and dreamlike before a short-lived chorus.","cdm-sod"),
q("honesty","Interviews",1,"Which quality did Maxwell say he would always hold dear in his work?",["Honesty","Virtuosity","Mystery","Perfection"],0,"He described honesty as likely the most important factor.","cdm-sod"),
q("move","Origins",1,"Which move did Coup de Main ask Maxwell about in 2019?",["Wellington to Auckland","Auckland to London","Sydney to Wellington","Los Angeles to Auckland"],0,"The interview discusses his move from Wellington to Auckland.","cdm-sod"),
q("snail","Collaborators",2,"Whose New Zealand dates was Maxwell announced to open?",["Snail Mail","Clairo","The 1975","Taylor Swift"],0,"Coup de Main noted the upcoming Snail Mail opening dates.","cdm-sod"),
q("pirrit-sod","Visuals",2,"Who did Maxwell credit with artwork for his new 2019 material?",["Max Pirrit","Karen Ishiguro","Tom Shackleton","Nayan Patel"],0,"He told Coup de Main the art was made by Max Pirrit.","cdm-sod"),
q("dd-influence","Deep Cuts",2,"Which album inspired Daydreamer's project-minded narrative approach?",["American Boyfriend","Blonde","Melodrama","Carrie & Lowell"],0,"Maxwell named Kevin Abstract's American Boyfriend.","rngldr"),
q("dd-form","Songs",2,"How did Maxwell look back on Daydreamer?",["As a diary of his teenage experience","As a live album","As an instrumental tape","As a covers record"],0,"He called it a diary of sorts that encapsulated his teenage experience.","rngldr"),
q("or-form","Songs",2,"What form did Maxwell use to describe Only Romantics?",["A specific vignette","A soundtrack commission","A remix anthology","A greatest-hits set"],0,"He contrasted its specific vignette with Daydreamer's diary form.","rngldr"),
q("iridescence","Deep Cuts",3,"Which BROCKHAMPTON album was a major Only Romantics inspiration?",["Iridescence","Saturation II","Ginger","Roadrunner"],0,"He named Iridescence and described it as broken, experimental and heartfelt.","rngldr"),
q("sonder","Deep Cuts",3,"Which genre phrase did Maxwell say he quite liked?",["Sonder Pop","Ocean Grunge","Cloud Folk","New Sincerity"],0,"He said the phrase Sonder Pop captured the post-bedroom-pop confusion.","rngldr"),
q("casey-send","Origins",2,"What led Maxwell to send a beat to Casey Neistat?",["A friend suggested it in maths class","A label contest","A radio producer asked","A festival submission"],0,"He recounted friend Nick suggesting it while they listened in maths class.","rngldr"),
q("casey-count","Deep Cuts",3,"About how many Casey Neistat videos did Maxwell say featured his music?",["20","2","50","100"],0,"He recalled the first of about 20 videos appearing by the time he woke.","rngldr"),
q("or-tracks","Current Canon",1,"How many tracks are on Only Romantics?",["Six","Four","Eight","Ten"],0,"Bandcamp lists six tracks.","bandcamp-or"),
q("or-date","Current Canon",2,"When was Only Romantics released?",["May 15, 2019","July 15, 2018","May 15, 2020","September 5, 2022"],0,"The Bandcamp release date is May 15, 2019.","bandcamp-or"),
q("or-art","Visuals",2,"Who are credited for Only Romantics artwork?",["Max Pirrit and Ilena Shadbolt","Tom Shackleton and Nayan Patel","Karen Ishiguro and Rose Riddell","Eddie Johnston and Clairo"],0,"Bandcamp credits Max Pirrit and Ilena Shadbolt.","bandcamp-or"),
q("or-princess","Collaborators",3,"Who co-produced Princess on Only Romantics?",["Sasha Daze","Instupendo","Lontalius","Thom Haha"],0,"The Bandcamp credits name Sasha Daze.","bandcamp-or"),
q("or-sax","Collaborators",3,"Who played saxophone on Forevermore?",["Theo Hertzig","Xandre Frederick","Barry Grint","Tom Verberne"],0,"Theo Hertzig is credited for saxophone.","bandcamp-or"),
q("or-vocals","Collaborators",3,"Who provided additional vocals on Kindred Spirits?",["seungjin","Clairo","Ch'lita","Snail Mail"],0,"Bandcamp credits seungjin with additional vocals.","bandcamp-or"),
q("turnup","Current Canon",1,"Who shares the artist credit on Turn It Up?",["Thom Haha","Eddie Johnston","Lontalius","Instupendo"],0,"The official release field credits Maxwell Young and Thom Haha.","official"),
q("wintour-art","Visuals",2,"Who is credited for the Wintour artwork?",["Elijah Broughton","Max Pirrit","Millie Dow","Ilena Shadbolt"],0,"The official release credits list Elijah Broughton.","official"),
q("flying-time","Current Canon",2,"What duration is listed for Flying?",["1:52","2:52","3:20","0:59"],0,"The official catalog lists Flying at 1:52.","official")
];


// Cover round: generated from the official release catalogue so artwork,
// titles, and order stay in lockstep with src/data/releases.ts.
const coverPool = releases.filter((release) => release.artwork);
const coverQuestions: Question[] = coverPool.map((release, index) => {
  const others = [5, 9, 13].map(
    (offset) => coverPool[(index + offset) % coverPool.length]!.title,
  );
  const answer = index % 4;
  const options = [...others];
  options.splice(answer, 0, release.title);
  return {
    id: `cover-${release.slug}`,
    category: "Covers",
    difficulty: index < 8 ? 1 : 2,
    prompt: "Which release wears this cover?",
    options,
    answer,
    explanation: `${release.title} (${release.releaseDate ?? "release date in the archive"}) carries this artwork in the official catalogue.`,
    sourceId: "official",
    artwork: release.artwork,
  };
});

questions.push(...coverQuestions);
