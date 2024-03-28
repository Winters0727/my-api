import type { CharacterName } from "./character.type";

type KorCardType = "공격" | "부여" | "대응";
type KorCardSubType = "대응" | "전력";
type KorCardCategory = "통상패" | "비장패" | "추가패";

type CardValue = "X" | "-" | number;

type CardType = KorCardCategory;
type CardSubType = KorCardSubType;
type CardCategory = KorCardCategory;

interface CardData {
  name: string;
  type: CardType;
  subType: CardSubType[];
  imagePath: string;
  description: string;
  category: CardCategory;
}

interface BaseCard {
  fullCode: string;
  code: string;
  charName: CharacterName;
  korData: CardData;
  engData: CardData;
  jpnData: CardData;
  relatedExtraCards: string[];
  revisionCount: number;
}

export interface AttackCard extends BaseCard {
  distance: string;
  damage: string;
}
export interface ActionCard extends BaseCard {}
export interface DeployCard extends BaseCard {
  enhancementCount: "X" | number;
}

export type NormalCard = AttackCard | ActionCard | DeployCard;

export type SpecialCard = NormalCard & { cost: CardValue };

export type Card = NormalCard | SpecialCard;
