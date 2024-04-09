import type { CharacterName } from "./character.type";

type KorCardType = "공격" | "부여" | "대응" | "미정";
type KorCardSubType = "대응" | "전력" | "미정";
type KorCardCategory =
  | "통상패"
  | "비장패"
  | "변형"
  | "독"
  | "구상"
  | "병사"
  | "미정";

type EngCardType = "Attack" | "Action" | "Enhancement" | "Undefined";
type EngCardSubType = "Reaction" | "Throughout" | "Undefined";
type EngCardCategory =
  | "Normal"
  | "Special"
  | "Transform"
  | "Poison"
  | "Plot"
  | "Unit"
  | "Parts"
  | "Undefined";

type JpnCardType = "攻撃" | "行動" | "付与" | "不定";
type JpnCardSubType = "全力" | "対応" | "不定";
type JpnCardCategory =
  | "通常札"
  | "切札"
  | "変形"
  | "毒"
  | "構想"
  | "兵士"
  | "パーツ"
  | "不定";

type CardValue = "X" | "-" | number;

type CardType = KorCardType | EngCardType | JpnCardType;
type CardSubType = KorCardSubType | EngCardSubType | JpnCardSubType;
type CardCategory = KorCardCategory | EngCardCategory | JpnCardCategory;

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
  character: CharacterName;
  kor: CardData;
  eng: CardData;
  jpn: CardData;
  relatedExtraCards: string[];
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
