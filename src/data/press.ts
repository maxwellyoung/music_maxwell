export interface PressItem {
  id: string;
  title: string;
  publication: string;
  date: string;
  type: "interview" | "feature" | "review" | "premiere";
  excerpt?: string;
  url: string;
}

export const pressItems: PressItem[] = [
  {
    id: "1",
    title: "Maxwell Young Finds His Voice on DIY Pop Debut Project 'Daydreamer'",
    publication: "Complex / Pigeons & Planes",
    date: "2018-08-01",
    type: "feature",
    excerpt: "The New Zealand artist evolved from warm hip-hop beat tapes to crafting a bedroom pop project inspired by movies like 10 Things I Hate About You and Kevin Abstract's American Boyfriend.",
    url: "https://www.complex.com/pigeons-and-planes/2018/08/maxwell-young-daydreamer",
  },
  {
    id: "2",
    title: "Interview: Maxwell Young on his new single 'No. 5'",
    publication: "Coup De Main Magazine",
    date: "2019-06-15",
    type: "interview",
    excerpt: "\"The most cathartic & important song I've written & released.\" Maxwell Young discusses his songwriting process and what makes this track special.",
    url: "https://www.coupdemainmagazine.com/maxwell-young/16163",
  },
  {
    id: "3",
    title: "Interview: Maxwell Young on 'Sketches Of Dragonflies' and 2019 plans",
    publication: "Coup De Main Magazine",
    date: "2019-01-10",
    type: "interview",
    excerpt: "A vulnerable reflection on maladaptive daydreaming. \"I've never been the best in technicalities or skill, but what I've grown to be good at is being honest.\"",
    url: "https://www.coupdemainmagazine.com/nz-on-air/15375",
  },
  {
    id: "4",
    title: "Maxwell Young shares hedonistic new single 'Turn It Up'",
    publication: "Sniffers",
    date: "2024-02-15",
    type: "premiere",
    excerpt: "\"Disassociation pop\" - somewhere between a bad dream and a shoplifting spree. Warbling bass lines and breakbeat percussion with animated melodies.",
    url: "https://www.sniffers.co.nz/article/70882-2",
  },
];
