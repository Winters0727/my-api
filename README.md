## 후루요니 API

### API Endpoint

`http://api.winters0727.kr/furuyoni`

※ 아직 https를 지원하지 않습니다.

#### 카드 데이터(`/card`)

※ 영어, 일본어 데이터는 미입력상태입니다.

- GET('/:code/?lang=lang'): 카드 데이터를 불러옵니다.

  - 파라미터
    - `code`: 카드의 전체코드입니다. (ex.`NA-01-yurina-O-N-1`)
  - 쿼리
    - `lang`: `kor`, `eng`, `jpn` 세가지 값을 가지며, 기본값은 `kor`입니다.
  - 200

    ```
    type Card = {
        fullCode: string; // 카드의 전체 코드 (ex. NA-01-yurina-O-N-1)
        code: string; // 캐릭터 정보를 제외한 카드의 코드 (ex. O-N-1)
        charName: string; // 카드를 사용하는 캐릭터의 영어 이름
        relatedExtraCards: string[]; // 카드와 관련돤 추가패의 전체 코드 배열
        distance?: string; // 공격 카드의 적정거리
        shieldDamage?: stirng; // 공격 카드의 오라 데미지
        hpDamage?: string; // 공격 카드의 라이프 데미지
        deployCount?: string; // 부여 카드의 봉납
        cost?: string; // 비장패의 비용입니다.
        data: {
          name: string; // 카드의 이름
          type: string; // 카드의 타입 (공격, 행동, 부여, 미정, 일반)
          subType: string; // 카드의 서브타입 (대응, 전력, 미정)
          description: string; // 카드 설명
        }
      };

    {
      result: "success";
      card: Card;
    }
    ```

  - 404, 500
    ```
    {
      result: "fail";
      error: string;
    }
    ```

- GET('character/:charName?mode=mode&lang=lang'): 캐릭터별 카드 데이터를 불러옵니다.
  - 파라미터
    - `charName`: 캐릭터 이름입니다. 이름값은 한글, 영어, 일본어 모두 가능합니다.
  - 쿼리
    - `mode`: `O`, `A1`, `A2`, `AA1` 네가지 값을 가집니다.
    - `lang`: `kor`, `eng`, `jpn` 세가지 값을 가지며, 기본값은 `kor`입니다.
  - 200
    ```{
      result: "success";
      card: {
        normalCards: string[];
        specialCards: string[];
        extraCards: string[];
      };
    }
    ```
  - 404, 500
    ```{
      result: "fail";
      error: string;
    }
    ```

#### 캐릭터 데이터(`/character`)

※ 영어, 일본어 데이터는 미입력상태입니다.

- GET('?lang=lang'): 캐릭터 리스트를 불러옵니다.
  - 쿼리
    - `lang`: `kor`, `eng`, `jpn` 세가지 값을 가지며, 기본값은 `kor`입니다.
  - 200
    ```
    {
      result: "success";
      characters: string[];
      length: number;
    }
    ```
  - 404, 500
    ```
    {
      result: "fail";
      error: string;
    }
    ```
- GET('/:parameter?lang=lang'): 캐릭터 데이터를 불러옵니다.

  - 파라미터
    - `parameter`: 캐릭터의 이름 또는 코드(`NA-XX`)입니다. 이름값은 한글, 영어, 일본어 모두 가능합니다.
  - 쿼리
    - `lang`: `kor`, `eng`, `jpn` 세가지 값을 가지며, 기본값은 `kor`입니다.
  - 200

    ```
    type Character = {
        code: string; // 캐릭터 코드 (ex. NA-01)
        mode: string[]; // 캐릭터 모드 (O, A1, A2, AA1) 배열
        normalCards: { [key in mode]: stirng[] }; // 모드별 통상패 배열
        specialCards: { [key in mode]: stirng[] }; // 모드별 비장패 배열
        extralCards: { [key in mode]: stirng[] }; // 모드별 추가패 배열
        data: {
          name: { [key in mode]: string }; // 캐릭터 이름
          abilityKeyword: string; // 캐릭터 능력 키워드
          abilityDescription: string; // 캐릭터 능력 키워드 설명
          symbolWeapon: string; // 캐릭터 상징 무기
          symbolSub: { [key in mode]: string }; // 캐릭터 어나더 모드 상징 무기 서브타입
        }
      };

    {
      result: "success";
      character: Character;
    }
    ```

  - 404, 500

    ```
    {
      result: "fail";
      error: string;
    }
    ```

#### 질의응답(`/faq`)

※ 영어, 일본어 데이터는 지원하지 않습니다.

- GET('/category'): 질의응답 데이터의 카테고리 배열을 불러옵니다.
  - 200
    ```
    {
      result: "success";
      category: string[],
      length: number;
    }
    ```
  - 404, 500
    ```
    {
      result: "fail";
      error: string;
    }
    ```
- GET('?category=category&keyword=keyword'): 카드 데이터를 불러옵니다.

  - 쿼리

    - `category`: 질의응답의 분류값으로 자세한 값은 카테고리 리스트 API를 참고해주세요.
    - `keyword`: 질문을 찾는데 사용할 검색어를 의미합니다.

    ※ `category` 또는 `keyword` 둘 중 하나의 쿼리는 반드시 포함되어야 합니다.

  - 200

    ```
    type FAQ {
      category: string;
      question: string;
      answer: string;
    }

    {
      result: "success";
      faq: FAQ[];
      length: number
    }
    ```

  - 404, 500
    ```
    {
      result: "fail";
      error: string;
    }
    ```
