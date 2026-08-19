export type ReleaseMaterialName =
  | "signal"
  | "cart-grid"
  | "editorial"
  | "field-note"
  | "air";

export type ReleaseMaterial = {
  paper: string;
  ink: string;
  accent: string;
  wash: string;
  texture: ReleaseMaterialName;
};

export type ReleaseWorld = {
  material: ReleaseMaterial;
};

export const releaseWorlds: Record<string, ReleaseWorld> = {
  "1kiss": {
    material: {
      paper: "#0b0e17",
      ink: "#f5f8ff",
      accent: "#8ea6ff",
      wash: "#111728",
      texture: "signal",
    },
  },
  wintour: {
    material: {
      paper: "#efede6",
      ink: "#111111",
      accent: "#c61f36",
      wash: "#ded9cf",
      texture: "editorial",
    },
  },
  "turn-it-up": {
    material: {
      paper: "#f4f5ef",
      ink: "#152018",
      accent: "#6f8468",
      wash: "#dfe7d9",
      texture: "cart-grid",
    },
  },
};

export const releaseWorldFor = (slug: string) => releaseWorlds[slug];
