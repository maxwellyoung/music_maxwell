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
  href: string;
  material: ReleaseMaterial;
};

export const releaseWorlds: Record<string, ReleaseWorld> = {
  "1kiss": {
    href: "/1kiss",
    material: {
      paper: "#0b0e17",
      ink: "#f5f8ff",
      accent: "#8ea6ff",
      wash: "#111728",
      texture: "signal",
    },
  },
  "Sneakin Drinks Into Bars": {
    href: "/sneakin",
    material: {
      paper: "#f2ede4",
      ink: "#171411",
      accent: "#c43762",
      wash: "#eadfce",
      texture: "field-note",
    },
  },
  Flying: {
    href: "/flying",
    material: {
      paper: "#dce9f2",
      ink: "#102230",
      accent: "#315b76",
      wash: "#cbdde9",
      texture: "air",
    },
  },
  Wintour: {
    href: "/wintour",
    material: {
      paper: "#efede6",
      ink: "#111111",
      accent: "#c61f36",
      wash: "#ded9cf",
      texture: "editorial",
    },
  },
  "Turn It Up": {
    href: "/turn-it-up",
    material: {
      paper: "#f4f5ef",
      ink: "#152018",
      accent: "#6f8468",
      wash: "#dfe7d9",
      texture: "cart-grid",
    },
  },
};

export const releaseWorldFor = (title: string) => releaseWorlds[title];
