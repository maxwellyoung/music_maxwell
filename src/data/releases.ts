// Release pipeline data - synced from mx CLI
// Last synced: 2026-01-20T06:12:37.927Z
// Run: mx sync-website to update this file

export interface ReleaseTrack {
  id: string;
  title: string;
  collection: string;
  status: string;
  targetRelease: string;
  submitBy: string;
  pitchBy: string;
  tasks: {
    vocals: boolean;
    mixed: boolean;
    mastered: boolean;
    artwork: boolean;
    lyrics: boolean;
    pitch: boolean;
    submitted: boolean;
  };
  pitch: {
    description: string;
    story: string;
    genres: string[];
    moods: string[];
    instruments: string[];
    similarArtists: string[];
  };
  notes: string;
  links?: {
    spotify?: string;
    appleMusic?: string;
    youtube?: string;
  };
}

export interface ReleasesConfig {
  artistName: string;
  leadTimeDays: number;
  pitchLeadTimeDays: number;
  artworkArtist: string;
  artworkDealStatus: string;
  distributor: string;
}

export interface ReleasesData {
  config: ReleasesConfig;
  tracks: ReleaseTrack[];
  released: ReleaseTrack[];
}

export const releasesData: ReleasesData = {
  "config": {
    "artistName": "Maxwell Young",
    "leadTimeDays": 21,
    "pitchLeadTimeDays": 14,
    "artworkArtist": "Elijah Broughton",
    "artworkDealStatus": "pending",
    "distributor": "Kartel"
  },
  "tracks": [
    {
      "id": "mollyrock",
      "title": "mollyrock",
      "collection": "in-my-20s",
      "status": "needs-art",
      "targetRelease": "2026-02-15",
      "submitBy": "2026-01-25",
      "pitchBy": "2026-02-01",
      "tasks": {
        "vocals": true,
        "mixed": true,
        "mastered": true,
        "artwork": false,
        "lyrics": false,
        "pitch": false,
        "submitted": false
      },
      "pitch": {
        "description": "",
        "story": "",
        "genres": [],
        "moods": [],
        "instruments": [],
        "similarArtists": []
      },
      "notes": "Ready to go - just needs artwork from Elijah"
    },
    {
      "id": "1kiss",
      "title": "1kiss",
      "collection": "in-my-20s",
      "status": "needs-vocals",
      "targetRelease": "2026-03-15",
      "submitBy": "2026-02-22",
      "pitchBy": "2026-03-01",
      "tasks": {
        "vocals": false,
        "mixed": false,
        "mastered": false,
        "artwork": false,
        "lyrics": false,
        "pitch": false,
        "submitted": false
      },
      "pitch": {
        "description": "",
        "story": "",
        "genres": [],
        "moods": [],
        "instruments": [],
        "similarArtists": []
      },
      "notes": "Multiple versions exist - pick best one"
    },
    {
      "id": "unsaid",
      "title": "unsaid",
      "collection": "in-my-20s",
      "status": "needs-vocals",
      "targetRelease": "2026-04-15",
      "submitBy": "2026-03-25",
      "pitchBy": "2026-04-01",
      "tasks": {
        "vocals": false,
        "mixed": false,
        "mastered": false,
        "artwork": false,
        "lyrics": false,
        "pitch": false,
        "submitted": false
      },
      "pitch": {
        "description": "",
        "story": "",
        "genres": [],
        "moods": [],
        "instruments": [],
        "similarArtists": []
      },
      "notes": "v2 in projects folder"
    }
  ],
  "released": []
};

// Helper to get upcoming releases (future release dates)
export function getUpcomingReleases(): ReleaseTrack[] {
  const now = new Date();
  return releasesData.tracks
    .filter((t) => new Date(t.targetRelease) > now)
    .sort(
      (a, b) =>
        new Date(a.targetRelease).getTime() - new Date(b.targetRelease).getTime()
    );
}

// Helper to get next upcoming release
export function getNextRelease(): ReleaseTrack | null {
  const upcoming = getUpcomingReleases();
  return upcoming[0] ?? null;
}

// Helper to get release by ID
export function getReleaseById(id: string): ReleaseTrack | null {
  return (
    releasesData.tracks.find((t) => t.id === id) ??
    releasesData.released.find((t) => t.id === id) ??
    null
  );
}
