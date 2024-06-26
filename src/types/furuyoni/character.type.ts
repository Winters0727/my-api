import type { Card } from "@customTypes/furuyoni/card.type";

export type CharacterMode = "O" | "A1" | "A2" | "AA1";

export type CharacterCards = {
  [mode in CharacterMode]: string[];
};

export type CharacterName =
  | "akina"
  | "chikage"
  | "hagane"
  | "hatsumi"
  | "himika"
  | "honoka"
  | "kamuwi"
  | "kanawe"
  | "korunu"
  | "kururu"
  | "megumi"
  | "misora"
  | "mizuki"
  | "oboro"
  | "raira"
  | "renri"
  | "saine"
  | "shinra"
  | "shisui"
  | "thallya"
  | "tokoyo"
  | "utsuro"
  | "yatsuha"
  | "yukihi"
  | "yurina";

export interface CharacterData {
  name: {
    [mode in CharacterMode]: string;
  };
  imagePath: {
    [mode in CharacterMode]: string;
  };
  abilityKeyword: string;
  abilityDescription: string;
  symbolWeapon: string;
  symbolSub: {
    [mode in CharacterMode]: string;
  };
}

export interface Character {
  code: string;
  kor: CharacterData;
  eng: CharacterData;
  jpn: CharacterData;
  mode: CharacterMode[];
  normalCards: CharacterCards[] | Card[];
  specialCards: CharacterCards[] | Card[];
  extraCards: CharacterCards[] | Card[];
}
