export interface Entity {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  maxHealth: number;
  type: string;
  speed: number;
  animFrame?: number;
  [key: string]: any;
}

export interface Player extends Entity {
  gold: number;
  weaponLevel: number;
  bowLevel: number;
  armorLevel: number;
  horseLevel: number;
  isHorseback: boolean;
  ammo: number;
  maxAmmo: number;
  reloadTimer: number;
  facing: 1 | -1;
  animFrame: number;
}

export interface Enemy extends Entity {
  enemyType: 'robber' | 'archer' | 'boss';
  attackTimer: number;
  damage: number;
  goldValue: number;
  isWithdrawing?: boolean;
  hasShot?: boolean;
  isCharging?: boolean;
  chargeTimer?: number;
  chargeWarningTimer?: number;
  spawnSide: 'left' | 'right';
  animFrame: number;
  [key: string]: any;
}

export interface Projectile extends Entity {
  owner: 'player' | 'enemy';
  damage: number;
  angle: number;
}

export interface SceneryObject {
  id: string;
  x: number;
  y: number;
  type: string;
  speed: number;
  scale: number;
  [key: string]: any;
}

export interface GameState {
  distance: number;
  maxDistance: number;
  isGameOver: boolean;
  isPaused: boolean;
  isShopOpen: boolean;
  isBossFight: boolean;
  isKnighting: boolean;
  isCinematic: boolean;
  isVictory: boolean;
  hasStarted: boolean;
  score: number;
  level: number;
  [key: string]: any;
}

export interface FloatText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  life: number;
  opacity?: number;
  vy?: number;
  [key: string]: any;
}
