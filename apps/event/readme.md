# 이벤트 설계에 대한 고민

## 유효성 검증

다양한 유형의 이벤트 완료 조건 대한 고민은 그렇게 크지 않았습니다. 코드로 표현하기 위해서는 각 완료 조건에 대한 정형화가 필요하고 이 부분은 과감히 타입별 별도 구현으로 넘기기로 했습니다. 다만 하나의 스키마에 유형(type)으로 구분이 되기 때문에 유형별 정의가 명확해야 했습니다.

```tsx
export type EventConditionDocument = HydratedDocument<EventCondition>;

@Schema()
export class EventCondition {
  @Prop({ required: true, default: () => uuidv7() })
  uuid: string;

  @Prop({ required: true, type: String, enum: Object.values(EVENT_TYPE_MAP) })
  type: EventType;

  @Prop({ required: true, default: () => new Date() })
  createdAt: Date;

  @Prop({ required: true, default: () => new Date() })
  updatedAt: Date;

  @Prop({ required: true, type: Object })
  config: any;
}

export const EventConditionSchema =
  SchemaFactory.createForClass(EventCondition);

EventConditionSchema.set('timestamps', true);
EventConditionSchema.index({ eventUuid: 1, uuid: 1 }, { unique: true });
```

config 필드에는 어떤 데이터도 들어갈 수 있기 때문에 이벤트 완료 조건에 대한 사전 정의 및 유효성 검증이 철저하게 이루어져야 한다고 생각했습니다. 사전 정의와 유효성 검증이 철저할 경우 이벤트 타입 추가마다 사람의 수고스러움이 증가하지만 이 부분은 어쩔 수 없는 부분이라고 생각하고 이벤트 타입의 추가를 다른 코드에 영향을 최대한 덜 주는 구조로 설계하였습니다.

먼저 유효성 검사는 철저하게, 이벤트 유형의 추가는 번거롭지 않게 라는 원칙을 지키기 위해 이벤트 타입별로 유효성 검사를 편하게 할 수 있는 커스텀 데코레이터를 만들었습니다. 아래는 이벤트 완료 조건을 추가할 때 실제로 호출되는 검증 함수입니다.

```tsx
import { BadRequestException } from '@nestjs/common';
import { EVENT_TYPE_MAP } from '../constants/event.constant';
import { EventType } from '../types/event.type';
import { validate as validateMonsterKill } from './monster-kill.validator';

export const validate = (type: EventType, data: any) => {
  switch (type) {
    case EVENT_TYPE_MAP.KILL_MONSTER:
      return validateMonsterKill(data);
    default:
      throw new BadRequestException('Invalid event type');
  }
};
```

위와같이 이벤트 타입이 추가될 경우 이벤트 완료 조건에 대한 유효성 검사 함수를 하나하나 다 구현해주어야 합니다. 아래는 Dto에서의 사용 예시입니다. `@Validate(EventConfigValidator)` 데코레이터를 필드에 추가할 경우 내부 타입에 따라 정의된 유효성 검사를 수행합니다.

```tsx
export class RegisterEventConditionDto {
  @IsString()
  @IsIn(Object.values(EVENT_TYPE_MAP))
  type: EventType;

  @Validate(EventConfigValidator)
  config: any;
}
```

## 이벤트 완료 조건

이벤트 완료 조건에 대한 검증도 비슷한 구조로 만들었습니다. 각 이벤트 타입별 완료 조건을 검증하는 클래스를 불러오는 팩토리를 만들고 동일한 인터페이스를 구현한 구현체를 주입하여 타입에 맞게 불러올 수 있도록 하였습니다.

```tsx
export interface EventCondition<T> {
  checkCondition(data: T): Promise<boolean>;
}
```

```tsx
import { BadRequestException, Injectable } from '@nestjs/common';
import { EVENT_TYPE_MAP } from './constants/event.constant';
import { EventConditionKillMonsterService } from './event-condition-kill-monster.service';
import { EventType } from './types/event.type';

@Injectable()
export class EventConditionFactory {
  constructor(
    private readonly eventConditionKillMonsterService: EventConditionKillMonsterService,
  ) {}

  getCondition(type: EventType) {
    switch (type) {
      case EVENT_TYPE_MAP.KILL_MONSTER:
        return this.eventConditionKillMonsterService;
      default:
        throw new BadRequestException(`Invalid event type: ${type}`);
    }
  }
}
```

## 이벤트 참여자

이벤트 적용 대상을 전체 유저가 아닌 이벤트 참여자로 분리하여 조건을 만족할 경우 이벤트 참여자가 되도록 구성하였습니다. 잠자고 있는 수많은 캐릭터들 까지 대상이 될 필요는 없다고 생각했으며 이벤트 별 이벤트 참여자 정보를 보기에 유리하다고 판단했습니다.

## 보상

보상에 대한 고민은 많은 시간동안 진행하지 못해 현재 참여자에게 중복 보상이 이루어지지 않는 정도만 구현되어 있습니다.

# 고민은 했지만 실제 구현으로까지는 이어지지 못한 이야기

최초에는 현재 규모보단 복잡도가 더 높은 시스템으로 생각하고 있었습니다. 현재는 이벤트별 완료 조건이 하나이지만 대규모 이벤트일 경우 아래와 같을 수 있다고 생각했습니다.

- 여러 이벤트 완료 조건이 존재하고 완료 조건별 기간이 별도로 존재함.
- 각 완료 조건별로 보상이 있을 수 있음
- 이벤트 전체 기간동안 작은 단위의 기간 완료 조건이 존재할 수 있음
  - ex) 8월 2주간 이벤트를 진행할 경우
  - 전체 출석 이벤트가 존재함
  - 1주차에는 특정한 던전이 열리고 여기를 깨면 보상을 줌
  - 2주차에는 인기도교환을 10회 이상 하면 보상을 줌
- 각 이벤트 완료 조건에 대한 선행 조건이 있을 수 있고 이 형태가 선형 구조가 아닐 수 있음
  ```tsx
            [이벤트 A - 튜토리얼 완료]
                       |
                       ▼
         [이벤트 B - 슬라임 100마리 처치]
                   /      \
                  ▼        ▼
  [이벤트 C - 아이템 제작]   [이벤트 D - 보스 처치]
                  \        /
                   ▼      ▼
         [이벤트 E - 최종 보상 수령]
  ```

위와 같은 작은 고민들이 있었지만 실제 구현까지는 이어지지 못하고 현재의 작은 시스템으로 구현하게 되었습니다.

# Event

| 필드명      | 타입          | 필수 여부 | 고유 값 | 기본값                  | 설명                                       |
| ----------- | ------------- | --------- | ------- | ----------------------- | ------------------------------------------ |
| uuid        | string        | ✅        | ✅      | uuidv7()                | 이벤트 고유 식별자                         |
| name        | string        | ✅        | ❌      | -                       | 이벤트 이름                                |
| description | string        | ✅        | ❌      | -                       | 이벤트 설명                                |
| state       | EventState    | ✅        | ❌      | EVENT_STATE_MAP.PENDING | 이벤트 상태 (예: PENDING / ACTIVE / ENDED) |
| startedAt   | Date          | ✅        | ❌      | -                       | 이벤트 시작 시간                           |
| endedAt     | Date          | ✅        | ❌      | -                       | 이벤트 종료 시간                           |
| condition   | object        | ❌        | ❌      | -                       | 이벤트 조건 정보 (자유형식)                |
| rewards     | EventReward[] | ❌        | ❌      | -                       | 이벤트 보상 목록 (`EventReward` 문서 배열) |

### 인덱스 정보

| 인덱스 필드                              | 설명                                 |
| ---------------------------------------- | ------------------------------------ |
| `{ state: 1, startedAt: 1, endedAt: 1 }` | 이벤트 상태 및 기간 조건 복합 인덱스 |
| `{ uuid: 1 }`                            | 이벤트 고유 식별자 인덱스 (유니크)   |

# EventCondition

| 필드명    | 타입      | 필수 여부 | 고유 값 | 기본값    | 설명                                       |
| --------- | --------- | --------- | ------- | --------- | ------------------------------------------ |
| uuid      | string    | ✅        | ✅      | uuidv7()  | 조건 고유 식별자                           |
| type      | EventType | ✅        | ❌      | -         | 이벤트 타입 (EVENT_TYPE_MAP 기반 enum)     |
| createdAt | Date      | ✅        | ❌      | 자동 생성 | 문서 생성 시각 (`timestamps: true`로 설정) |
| updatedAt | Date      | ✅        | ❌      | 자동 생성 | 문서 수정 시각 (`timestamps: true`로 설정) |
| config    | object    | ✅        | ❌      | -         | 조건별 설정 정보 (구조 자유롭게 정의 가능) |

# EventReward

| 필드명 | 타입            | 필수 여부 | 고유 값 | 기본값   | 설명                                  |
| ------ | --------------- | --------- | ------- | -------- | ------------------------------------- |
| uuid   | string          | ✅        | ❌      | uuidv7() | 보상 고유 식별자                      |
| type   | EventRewardType | ✅        | ❌      | -        | 보상 타입 (REWARD_TYPE_MAP 기반 enum) |
| name   | string          | ✅        | ❌      | -        | 보상 이름                             |
| count  | number          | ✅        | ❌      | -        | 보상 개수                             |
| itemId | string          | ✅        | ❌      | -        | 연결된 아이템 ID                      |

# EventParticipant

| 필드명         | 타입                      | 필수 여부 | 고유 값 | 기본값   | 설명                                     |
| -------------- | ------------------------- | --------- | ------- | -------- | ---------------------------------------- |
| uuid           | string                    | ✅        | ✅      | uuidv7() | 참여 고유 식별자                         |
| eventUuid      | string                    | ✅        | ❌      | -        | 이벤트 UUID                              |
| userUuid       | string                    | ✅        | ❌      | -        | 유저 UUID                                |
| completedAt    | Date                      | ❌        | ❌      | -        | 참여 조건 완료 시각                      |
| condition      | EventParticipantCondition | ✅        | ❌      | {}       | 참여 조건 정보 객체                      |
| claimedRewards | ClaimedReward[]           | ✅        | ❌      | []       | 수령한 보상 목록 (보상 정보 + 수령 시각) |

### ClaimedReward 타입 구조

| 필드명     | 타입   | 필수 여부 | 설명             |
| ---------- | ------ | --------- | ---------------- |
| rewardUuid | string | ✅        | 보상 고유 식별자 |
| type       | string | ✅        | 보상 타입        |
| name       | string | ✅        | 보상 이름        |
| count      | number | ✅        | 보상 개수        |
| itemId     | string | ✅        | 연결된 아이템 ID |
| claimedAt  | Date   | ✅        | 보상 수령 시각   |

# EventParticipantCondition (Sub)

| 필드명             | 타입      | 필수 여부 | 고유 값 | 기본값   | 설명                                          |
| ------------------ | --------- | --------- | ------- | -------- | --------------------------------------------- |
| uuid               | string    | ✅        | ✅      | uuidv7() | 참여 조건 고유 식별자                         |
| eventConditionUuid | string    | ✅        | ❌      | -        | 연결된 이벤트 조건의 UUID                     |
| type               | EventType | ✅        | ❌      | -        | 이벤트 타입 (EVENT_TYPE_MAP 기반 enum)        |
| completedAt        | Date      | ❌        | ❌      | -        | 조건 완료 시각                                |
| config             | object    | ✅        | ❌      | -        | 조건별 설정 정보 (조건에 따른 구조 정의 필요) |
