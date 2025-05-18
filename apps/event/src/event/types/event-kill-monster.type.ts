export type EventKillMonster = {
  monsterUuid: string;
  monsterName: string;
  monsterLevel: number;
  monsterType: string;
  monsterPosition: {
    x: number;
    y: number;
  };
};
