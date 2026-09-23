import { z } from "zod";

export const questions = [
  {
    id: "music",
    title: "What would you like to hear more of?",
    options: [
      "Quiet songs",
      "Something I can dance to",
      "Rough recordings",
      "Longer songs",
      "Whatever you're working on",
    ],
  },
  {
    id: "song",
    title: "Is there a song of mine you'd like me to follow further?",
    hint: "A sound, a line, a particular bit. It doesn't need to be a whole song.",
  },
  {
    id: "listening",
    title: "Where do you usually listen?",
    options: [
      "Walking somewhere",
      "At home",
      "On the way to work",
      "In the car",
      "I haven't listened yet",
    ],
  },
  {
    id: "stories",
    title: "What do you stop for on Instagram stories?",
    options: [
      "Music I'm working on",
      "Music other people made",
      "A bit of daily life",
      "Show and release dates",
      "A photograph with no explanation",
    ],
  },
  {
    id: "posts",
    title: "And posts?",
    options: [
      "Photographs",
      "A few things collected together",
      "Writing",
      "Artwork",
      "Just tell me when the song is out",
    ],
  },
  {
    id: "reels",
    title: "What would you watch a short video of?",
    options: [
      "A live song",
      "How a song came together",
      "Something filmed outside",
      "Me talking about something",
      "I'm trying to watch fewer short videos",
    ],
  },
  {
    id: "videos",
    title: "What do you like in a music video?",
    hint: "A story, a performance, a place. Or one you remember.",
  },
  {
    id: "frequency",
    title: "How often would you like to hear from me?",
    single: true,
    options: [
      "A few times a week",
      "Once a week or so",
      "When there's something new",
      "I will find you eventually",
    ],
  },
  { id: "missing", title: "Anything you miss seeing on the internet?" },
  { id: "less", title: "Anything you'd like less of?" },
  {
    id: "more",
    title: "Anything else you'd like me to make?",
    hint: "It can be quite specific.",
  },
  {
    id: "last",
    title: "Anything else?",
    hint: "You can leave this one empty too.",
  },
] satisfies {
  id: string;
  title: string;
  hint?: string;
  options?: string[];
  single?: boolean;
}[];

const answerSchema = z
  .record(
    z.string(),
    z.union([z.string().trim().max(2000), z.array(z.string().max(100)).max(5)]),
  )
  .superRefine((answers, ctx) => {
    for (const [key, value] of Object.entries(answers)) {
      const question = questions.find((q) => q.id === key);
      if (
        !question ||
        (question.options
          ? !Array.isArray(value) ||
            value.some((v) => !question.options.includes(v)) ||
            new Set(value).size !== value.length ||
            (question.single && value.length > 1)
          : typeof value !== "string")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please check your answers.",
        });
      }
    }
    if (!Object.values(answers).some((value) => value.length > 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Answer at least one question before sending.",
      });
    }
  });

export const listenerResponseSchema = z
  .object({
    submissionId: z.string().uuid(),
    answers: answerSchema,
  })
  .strict();
