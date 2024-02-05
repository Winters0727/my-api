import type { CharacterName } from "./character.type";

interface ChallengeSpeech {
  beforeBattle: string;
  challengerWin: string;
  challengerLose: string;
}

export type ChallengeMode = "C" | "H";

export type ChallengeData = {
  [key in ChallengeMode]: {
    ability: string;
    abilityDescription: string;
    storyDescription: string;
    speech: ChallengeSpeech;
  };
};

type AdditionalCards = {
  [key in ChallengeMode]: string[];
};

export interface Challenge {
  code: string;
  charName: CharacterName;
  korData: ChallengeData;
  engData: ChallengeData;
  jpnData: ChallengeData;
  additionalCards: AdditionalCards;
  revisionCount: number;
}
