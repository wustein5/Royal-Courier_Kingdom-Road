import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Sword, ArrowUp, Coins, MapPin, Heart, Crosshair, Play, RotateCcw,
  ShoppingBag, ChevronRight, Package, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { audioService } from './lib/audio';
import { 
  GAME_WIDTH, GAME_HEIGHT, PLAYER_START_X, PLAYER_START_Y,
  CARRIAGE_WIDTH, CARRIAGE_HEIGHT, HORSE_WIDTH, HORSE_HEIGHT,
  ENEMY_WIDTH, ENEMY_HEIGHT, PROJECTILE_SIZE, COLORS 
} from './constants';
import { Player, Enemy, Projectile, GameState, Entity, SceneryObject } from './types';

// FloatText type for damage/gold popups
interface FloatText { id: string; x: number; y: number; text: string; color: string; life: number; vy: number; }

// ─── Humanoid enemy drawing helper ───────────────────────────────────────────
function drawHumanoid(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, facing: number, legT: number, atkT: number,
  type: 'robber' | 'archer'
) {
  ctx.save();
  ctx.translate(x, y);
  if (facing === -1) { ctx.translate(ENEMY_WIDTH, 0); ctx.scale(-1, 1); }

  const isRobber = type === 'robber';
  const bodyC = isRobber ? '#37474f' : '#455a64';
  const accentC = isRobber ? '#263238' : '#37474f';
  const hatC = isRobber ? '#212121' : '#546e7a';
  const lo = Math.sin(legT * 0.08) * 7;
  const attacking = atkT > 1200;

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.beginPath(); ctx.ellipse(16, 54, 12, 4, 0, 0, Math.PI * 2); ctx.fill();

  // Back leg
  ctx.strokeStyle = accentC; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(10, 32); ctx.lineTo(10 + lo, 50); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10 + lo, 50); ctx.lineTo(18 + lo, 50); ctx.stroke();
  // Front leg
  ctx.strokeStyle = bodyC;
  ctx.beginPath(); ctx.moveTo(20, 32); ctx.lineTo(20 - lo, 50); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(20 - lo, 50); ctx.lineTo(28 - lo, 50); ctx.stroke();

  // Torso
  ctx.fillStyle = bodyC;
  ctx.beginPath(); ctx.roundRect(6, 12, 20, 22, 3); ctx.fill();
  ctx.fillStyle = accentC; ctx.fillRect(6, 30, 20, 3);
  ctx.fillStyle = '#fbc02d'; ctx.fillRect(13, 29, 6, 5);

  // Weapon arm
  ctx.save(); ctx.translate(24, 16); ctx.rotate(attacking ? -0.9 : 0.2);
  ctx.strokeStyle = bodyC; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 14); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 14); ctx.lineTo(5, 22); ctx.stroke();
  if (isRobber) {
    ctx.strokeStyle = '#cfd8dc'; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(5, 22); ctx.lineTo(22, 8); ctx.stroke();
    ctx.strokeStyle = '#fbc02d'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(2, 26); ctx.lineTo(10, 18); ctx.stroke();
  } else {
    ctx.strokeStyle = '#8d6e63'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(5, 14, 14, -1.2, 1.2); ctx.stroke();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-8, 4); ctx.lineTo(-8, 24); ctx.stroke();
  }
  ctx.restore();

  // Off arm
  ctx.save(); ctx.translate(8, 16); ctx.rotate(-0.2);
  ctx.strokeStyle = bodyC; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-3, 14); ctx.stroke();
  ctx.restore();

  // Head
  ctx.fillStyle = '#ffe0b2';
  ctx.beginPath(); ctx.arc(16, 6, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = hatC;
  ctx.beginPath(); ctx.ellipse(16, 2, 11, 5, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(7, -8, 18, 10);
  ctx.fillStyle = '#212121'; ctx.beginPath(); ctx.arc(20, 5, 2, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(21, 4.5, 0.8, 0, Math.PI * 2); ctx.fill();

  ctx.restore();
}

// ─── Boss drawing helper ──────────────────────────────────────────────────────
function drawBossCharacter(ctx: CanvasRenderingContext2D, enemy: Enemy, playerX: number, warnT: number) {
  const facing = enemy.x < playerX ? 1 : -1;
  const lo = Math.sin((enemy.chargeTimer || 0) * 0.015) * 12;
  const isCharging = enemy.isCharging || false;

  ctx.save();
  ctx.translate(enemy.x + enemy.width / 2, enemy.y);
  if (warnT > 0) ctx.globalAlpha = 0.6 + Math.sin(Date.now() * 0.03) * 0.4;
  if (facing === -1) { ctx.translate(enemy.width / 2, 0); ctx.scale(-1, 1); ctx.translate(-enemy.width / 2, 0); }

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.beginPath(); ctx.ellipse(0, 82, 22, 7, 0, 0, Math.PI * 2); ctx.fill();

  // Legs
  ctx.strokeStyle = '#b71c1c'; ctx.lineWidth = 9; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-6, 52); ctx.lineTo(-6 + lo, 78); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-6 + lo, 78); ctx.lineTo(8 + lo, 78); ctx.stroke();
  ctx.strokeStyle = '#d32f2f';
  ctx.beginPath(); ctx.moveTo(6, 52); ctx.lineTo(6 - lo, 78); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(6 - lo, 78); ctx.lineTo(20 - lo, 78); ctx.stroke();

  // Cape
  ctx.fillStyle = '#880e4f';
  ctx.beginPath(); ctx.moveTo(-14, 14); ctx.lineTo(-18, 70); ctx.lineTo(0, 58); ctx.closePath(); ctx.fill();

  // Torso
  ctx.fillStyle = '#c62828';
  ctx.beginPath(); ctx.roundRect(-14, 18, 28, 38, 5); ctx.fill();
  ctx.strokeStyle = '#fbc02d'; ctx.lineWidth = 2;
  ctx.strokeRect(-14, 18, 28, 38);
  ctx.fillStyle = '#455a64';
  ctx.beginPath(); ctx.roundRect(-8, 20, 16, 20, 3); ctx.fill();

  // Sword arm
  ctx.save(); ctx.translate(14, 24);
  ctx.rotate(isCharging ? -0.5 + Math.sin((enemy.chargeTimer || 0) * 0.02) * 0.4 : 0.3);
  ctx.strokeStyle = '#b71c1c'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, 20); ctx.stroke();
  ctx.strokeStyle = '#90a4ae'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.moveTo(0, 20); ctx.lineTo(38, -2); ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(4, 18); ctx.lineTo(36, 0); ctx.stroke();
  ctx.strokeStyle = '#fbc02d'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(-2, 24); ctx.lineTo(10, 14); ctx.stroke();
  ctx.restore();

  // Shield arm
  ctx.save(); ctx.translate(-14, 24); ctx.rotate(-0.2);
  ctx.strokeStyle = '#b71c1c'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-3, 18); ctx.stroke();
  ctx.fillStyle = '#37474f';
  ctx.beginPath(); ctx.roundRect(-14, 18, 18, 24, 4); ctx.fill();
  ctx.strokeStyle = '#fbc02d'; ctx.lineWidth = 2;
  ctx.strokeRect(-14, 18, 18, 24);
  ctx.fillStyle = '#fbc02d'; ctx.beginPath(); ctx.arc(-5, 30, 4, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // Head
  ctx.fillStyle = '#ffe0b2'; ctx.beginPath(); ctx.arc(0, 4, 13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#37474f';
  ctx.beginPath(); ctx.ellipse(0, -2, 15, 8, 0, Math.PI, 0); ctx.fill();
  ctx.fillRect(-14, -10, 28, 12);
  ctx.fillStyle = '#ef5350';
  ctx.beginPath(); ctx.moveTo(-3, -10); ctx.bezierCurveTo(-3, -28, 7, -28, 4, -10); ctx.fill();
  ctx.fillStyle = '#212121'; ctx.fillRect(-10, 1, 20, 4);
  ctx.fillStyle = '#ff1744';
  ctx.beginPath(); ctx.arc(-4, 3, 2.5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(4, 3, 2.5, 0, Math.PI * 2); ctx.fill();

  ctx.globalAlpha = 1;
  ctx.restore();
}

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    distance: 0, maxDistance: 3500, isGameOver: false, isPaused: true,
    isShopOpen: false, isBossFight: false, isKnighting: false,
    isCinematic: false, isVictory: false, hasStarted: false, score: 0, level: 1,
  });

  const [knightingTimer, setKnightingTimer] = useState(0);
  const [player, setPlayer] = useState<Player>({
    id: 'player', x: PLAYER_START_X, y: PLAYER_START_Y,
    width: CARRIAGE_WIDTH, height: CARRIAGE_HEIGHT,
    health: 100, maxHealth: 100, type: 'player', speed: 2, gold: 0,
    weaponLevel: 1, bowLevel: 1, armorLevel: 1, horseLevel: 1,
    isHorseback: false, ammo: 10, maxAmmo: 10, reloadTimer: 0, facing: 1,
  });

  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [scenery, setScenery] = useState<SceneryObject[]>([]);
  const [particles, setParticles] = useState<any[]>([]);
  const [floatTexts, setFloatTexts] = useState<FloatText[]>([]);
  const [lastTime, setLastTime] = useState(0);
  const [spawnTimer, setSpawnTimer] = useState(0);
  const [sceneryTimer, setSceneryTimer] = useState(0);
  const [swordSwing, setSwordSwing] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  // enemy leg animation timer (stored as ref to avoid re-renders)
  const enemyLegTimers = useRef<Record<string, number>>({});

  const requestRef = useRef<number>(null);
  const updateRef = useRef<any>();
  const drawRef = useRef<any>();

  const keys = useRef<{ [key: string]: boolean }>({});
  const pendingActions = useRef({ shoot: false, sword: false });
  const touchState = useRef({ active: false, startX: 0, startY: 0, currentX: 0, currentY: 0 });

  useEffect(() => {
    const handleTouchStart = () => setIsTouchDevice(true);
    window.addEventListener('touchstart', handleTouchStart, { once: true });
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
      if (e.code === 'Space') {
        setGameState(prev => {
          if (prev.isGameOver || prev.isShopOpen || !prev.hasStarted) return prev;
          return { ...prev, isPaused: !prev.isPaused };
        });
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => { keys.current[e.code] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const isPlaying = !gameState.isPaused && !gameState.isGameOver && !gameState.isShopOpen
      && !gameState.isKnighting && !gameState.isCinematic && !gameState.isVictory;
    if (isPlaying) audioService.updateMusic(gameState.isBossFight);
    else audioService.stopMusic();
    return () => audioService.stopMusic();
  }, [gameState.isPaused, gameState.isGameOver, gameState.isShopOpen,
      gameState.isKnighting, gameState.isBossFight, gameState.isCinematic, gameState.isVictory]);

  // ─── Scenery factory ──────────────────────────────────────────────────────
  const createScenery = (distance: number, maxDistance: number, level: number, currentScenery: SceneryObject[]) => {
    const progress = distance / maxDistance;
    const isNearEnd = progress > 0.5;
    const isVeryNearEnd = progress > 0.65;
    const hasCastle = currentScenery.some(s => s.type === 'castle');

    if (isVeryNearEnd && !hasCastle) {
      return { id: 'castle-' + level, x: GAME_WIDTH + 100, y: PLAYER_START_Y, type: 'castle', speed: 0.8, scale: 2.5 } as SceneryObject;
    }

    let types: ('tree' | 'house' | 'mountain' | 'stream' | 'side_road')[] = ['tree', 'house', 'mountain', 'stream'];
    if (isNearEnd) types = ['house', 'house', 'side_road', 'tree', 'mountain'];

    const type = types[Math.floor(Math.random() * types.length)];
    let y = 0, speed = 0, scale = 1;

    if (type === 'mountain') { y = 40 + Math.random() * 50; speed = 0.5; scale = 1.5 + Math.random(); }
    else if (type === 'tree') {
      y = Math.random() > 0.5 ? PLAYER_START_Y - 15 - Math.random() * 30 : PLAYER_START_Y + 75 + Math.random() * 30;
      speed = 2; scale = 0.8 + Math.random() * 0.5;
    }
    else if (type === 'stream') { y = PLAYER_START_Y + 65 + Math.random() * 40; speed = 2.5; scale = 1; }
    else if (type === 'side_road') { y = PLAYER_START_Y - 20 + Math.random() * 30; speed = 2; scale = 1; }
    else { // house — y is base of house at road edge
      y = Math.random() > 0.5 ? PLAYER_START_Y - 5 : PLAYER_START_Y + 80;
      speed = 2; scale = 1;
    }

    return { id: Math.random().toString(36).substr(2, 9), x: GAME_WIDTH + 100, y, type, speed, scale } as SceneryObject;
  };

  const createBoss = (level: number) => ({
    id: 'boss-' + Math.random().toString(36).substr(2, 9),
    x: GAME_WIDTH + 100, y: GAME_HEIGHT / 2 - 20,
    width: 100, height: 100,
    health: 500 + level * 200, maxHealth: 500 + level * 200,
    type: 'enemy' as const, enemyType: 'boss' as const,
    speed: 1, attackTimer: 0, chargeTimer: 0, isCharging: false,
    damage: 15, goldValue: 600, spawnSide: 'right' as const,
  });

  const createEnemy = (level: number) => {
    const type = Math.random() > 0.2 ? 'robber' : 'archer';
    const side = Math.random() > 0.5 ? 'left' : 'right';
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: side === 'right' ? GAME_WIDTH + 50 : -100,
      y: PLAYER_START_Y + (Math.random() * 80 - 40),
      width: ENEMY_WIDTH, height: ENEMY_HEIGHT,
      health: (type === 'robber' ? 24 : 20) + level * 10,
      maxHealth: (type === 'robber' ? 24 : 20) + level * 10,
      type: 'enemy' as const, enemyType: type as 'robber' | 'archer',
      speed: (type === 'robber' ? 2.5 : 1) + Math.random() * 1.5,
      attackTimer: 0, damage: (type === 'robber' ? 8 : 5) + level * 2,
      goldValue: type === 'robber' ? 35 : 20, spawnSide: side as 'left' | 'right',
    } as Enemy;
  };

  // ─── UPDATE ───────────────────────────────────────────────────────────────
  const update = useCallback((deltaTime: number) => {
    const dt = Math.min(deltaTime, 100);

    if (gameState.isKnighting) {
      setKnightingTimer(prev => {
        const next = prev + dt;
        if (next > 5000) {
          setGameState(gs => ({ ...gs, isKnighting: false, isShopOpen: true, distance: 0, level: gs.level + 1 }));
          setScenery([]);
          return 0;
        }
        return next;
      });
      return;
    }

    if (gameState.isPaused || gameState.isGameOver || gameState.isShopOpen || gameState.isVictory) return;

    let nextPlayer = { ...player };
    let nextGameState = { ...gameState };
    let nextEnemies = enemies.map(e => ({ ...e }));
    let nextProjectiles = projectiles.map(p => ({ ...p }));
    let nextScenery = scenery.map(s => ({ ...s }));
    let nextParticles = particles.map(p => ({ ...p }));
    let nextFloats = floatTexts.map(f => ({ ...f }));
    let spawnedProjectiles: Projectile[] = [];
    let playerDamageTaken = 0;

    // Distance & level
    if (!nextGameState.isBossFight) {
      nextGameState.distance += nextPlayer.speed;
      if (nextGameState.distance >= nextGameState.maxDistance && nextGameState.level % 2 === 0) {
        nextGameState.distance = nextGameState.maxDistance;
        nextGameState.isBossFight = true;
      } else if (nextGameState.distance >= nextGameState.maxDistance) {
        audioService.playShopOpen();
        nextGameState.isShopOpen = true;
        nextGameState.distance = 0;
        nextGameState.level += 1;
        nextEnemies = []; nextProjectiles = []; nextScenery = [];
      }
    }

    // Touch swipe movement
    const isSwipingLeft = touchState.current.active && (touchState.current.currentX - touchState.current.startX) < -30;
    const isSwipingRight = touchState.current.active && (touchState.current.currentX - touchState.current.startX) > 30;
    const isSwipingUp = touchState.current.active && (touchState.current.currentY - touchState.current.startY) < -30;
    const isSwipingDown = touchState.current.active && (touchState.current.currentY - touchState.current.startY) > 30;

    let dy = 0;
    if (keys.current['ArrowUp'] || isSwipingUp) dy -= 3;
    if (keys.current['ArrowDown'] || isSwipingDown) dy += 3;
    if (keys.current['ArrowLeft'] || isSwipingLeft) nextPlayer.facing = -1;
    if (keys.current['ArrowRight'] || isSwipingRight) nextPlayer.facing = 1;

    const minY = nextGameState.isBossFight ? PLAYER_START_Y - 120 : PLAYER_START_Y - 40;
    const maxY = nextGameState.isBossFight ? PLAYER_START_Y + 100 : PLAYER_START_Y + 60;
    nextPlayer.y = Math.min(Math.max(nextPlayer.y + dy, minY), maxY);

    const regenRate = nextPlayer.isHorseback ? 0.008 : 0;
    nextPlayer.health = Math.min(nextPlayer.maxHealth, nextPlayer.health + regenRate * dt);

    const targetX = nextGameState.isBossFight ? 200 : PLAYER_START_X;
    if (Math.abs(nextPlayer.x - targetX) > 2) nextPlayer.x += (nextPlayer.x < targetX ? 1 : -1) * 2;
    else nextPlayer.x = targetX;

    // Shoot
    if ((keys.current['KeyW'] || pendingActions.current.shoot) && nextPlayer.ammo > 0) {
      audioService.playArrow();
      const angle = nextPlayer.facing === 1 ? 0 : Math.PI;
      nextProjectiles.push({
        id: Math.random().toString(36).substr(2, 9),
        x: nextPlayer.facing === 1 ? nextPlayer.x + nextPlayer.width : nextPlayer.x,
        y: nextPlayer.y + nextPlayer.height / 2,
        width: PROJECTILE_SIZE, height: PROJECTILE_SIZE / 2,
        health: 1, maxHealth: 1, type: 'projectile',
        owner: 'player', speed: 10, damage: 10 + nextPlayer.bowLevel * 5, angle,
      });
      nextPlayer.ammo -= 1;
      keys.current['KeyW'] = false;
      pendingActions.current.shoot = false;
    }

    // Sword
    if ((keys.current['KeyQ'] || pendingActions.current.sword) && swordSwing <= 0) {
      audioService.playSword();
      setSwordSwing(15);
      pendingActions.current.sword = false;
      nextEnemies = nextEnemies.map(enemy => {
        const isRight = nextPlayer.facing === 1;
        const dx = isRight ? enemy.x - (nextPlayer.x + nextPlayer.width) : nextPlayer.x - (enemy.x + enemy.width);
        const edY = Math.abs(enemy.y - (nextPlayer.y + nextPlayer.height / 2));
        if (enemy.enemyType === 'archer') return enemy;
        if (dx < 80 && dx > -30 && edY < 80) {
          const dmg = 18 + nextPlayer.weaponLevel * 6;
          nextFloats.push({ id: Math.random().toString(36).substr(2,9), x: enemy.x + enemy.width/2 - 12, y: enemy.y - 10, text: `-${dmg}`, color: '#ff5252', life: 1, vy: -1.2 });
          for (let i = 0; i < 5; i++) nextParticles.push({ x: enemy.x + enemy.width/2, y: enemy.y + enemy.height/2, vx: (Math.random()-.5)*10, vy: (Math.random()-.5)*10-2, life: 0.7, color: '#fbc02d', size: 3 });
          return { ...enemy, health: enemy.health - dmg };
        }
        return enemy;
      });
    }
    if (swordSwing > 0) setSwordSwing(prev => prev - 1);

    // Reload
    if (nextPlayer.ammo < nextPlayer.maxAmmo) {
      nextPlayer.reloadTimer += dt;
      const reloadSpeed = Math.max(500, 4000 - (nextPlayer.bowLevel - 1) * 500);
      if (nextPlayer.reloadTimer >= reloadSpeed) { nextPlayer.ammo += 1; nextPlayer.reloadTimer = 0; }
    }

    // Scenery
    nextScenery = nextScenery.map(obj => {
      let speed = obj.speed;
      if (nextGameState.isBossFight && obj.type === 'castle') speed = 0.1;
      return { ...obj, x: obj.x - speed * (nextPlayer.speed / 2) };
    }).filter(obj => obj.x > -400);

    // Enemy AI
    nextEnemies = nextEnemies.map(enemy => {
      let nx = enemy.x;
      let nat = enemy.attackTimer + dt;
      let niw = enemy.isWithdrawing;
      let nhs = enemy.hasShot;

      // Update leg timer
      enemyLegTimers.current[enemy.id] = (enemyLegTimers.current[enemy.id] || 0) + 1;

      if (enemy.enemyType === 'robber') {
        const tx = nx < nextPlayer.x ? nextPlayer.x - enemy.width : nextPlayer.x + nextPlayer.width;
        const dir = nx < nextPlayer.x ? 1 : -1;
        if (Math.abs(nx - tx) > 10) { nx += dir * enemy.speed; nat = 0; }
        else { nx = tx; if (nat > 1500) { playerDamageTaken += enemy.damage; audioService.playHit(); nat = 0; } }
      } else if (enemy.enemyType === 'archer') {
        const dist = Math.abs(nx - nextPlayer.x);
        if (niw) {
          nx += (nx < nextPlayer.x ? -1 : 1) * (enemy.speed * 1.2);
          if (nx < 20) nx = 20; if (nx > GAME_WIDTH - 20) nx = GAME_WIDTH - 20;
          if (nat > 5000) { niw = false; nhs = false; nat = 0; }
        } else {
          if (dist > 250) nx += (nx < nextPlayer.x ? 1 : -1) * enemy.speed;
          else if (nat > 1500 && !nhs) {
            const angle = Math.atan2((nextPlayer.y + nextPlayer.height/2) - (enemy.y + enemy.height/2), nextPlayer.x - nx);
            spawnedProjectiles.push({ id: Math.random().toString(36).substr(2,9), x: nx, y: enemy.y + enemy.height/2, width: PROJECTILE_SIZE, height: PROJECTILE_SIZE/2, health: 1, maxHealth: 1, type: 'projectile', owner: 'enemy', speed: 5, damage: enemy.damage, angle });
            nat = 0; nhs = true; niw = true;
          }
        }
      } else if (enemy.enemyType === 'boss') {
        let nct = (enemy.chargeTimer || 0) + dt;
        let nic = enemy.isCharging || false;
        // Boss charge warning at 6s → flashes red 2s before charging at 8s
        const warnActive = nct > 6000 && nct < 8000 && !nic;
        if (nct > 6000 && nct < 6100 && !nic) audioService.playBossWarning();
        if (nic) {
          const tx = nx < nextPlayer.x ? nextPlayer.x - enemy.width : nextPlayer.x + nextPlayer.width;
          const dir = nx < nextPlayer.x ? 1 : -1;
          if (Math.abs(nx - tx) > 10) nx += dir * (enemy.speed * 4);
          else { nx = tx; if (nat > 500) { playerDamageTaken += enemy.damage * 1.5; audioService.playHit(); nat = 0; } }
          if (nct > 3000) { nic = false; nct = 0; }
        } else {
          const targetX = GAME_WIDTH - 200;
          if (nx > targetX) nx -= enemy.speed; else if (nx < targetX - 50) nx += enemy.speed;
          else {
            nx = targetX;
            if (nat > 2000) {
              for (let i = -1; i <= 1; i++) {
                const angle = Math.atan2((nextPlayer.y + nextPlayer.height/2) - (enemy.y + enemy.height/2) + i*60, nextPlayer.x - nx);
                spawnedProjectiles.push({ id: Math.random().toString(36).substr(2,9), x: nx, y: enemy.y + enemy.height/2, width: PROJECTILE_SIZE, height: PROJECTILE_SIZE/2, health: 1, maxHealth: 1, type: 'projectile', owner: 'enemy', speed: 5, damage: 3, angle });
              }
              nat = 0;
            }
          }
          if (nct > 8000) { nic = true; nct = 0; }
        }
        return { ...enemy, x: nx, attackTimer: nat, isCharging: nic, chargeTimer: nct };
      }
      return { ...enemy, x: nx, attackTimer: nat, isWithdrawing: niw, hasShot: nhs };
    }).filter(e => e.x > -200 && e.x < GAME_WIDTH + 200);

    // Projectiles
    nextProjectiles = [...nextProjectiles, ...spawnedProjectiles].map(p => ({
      ...p, x: p.x + Math.cos(p.angle) * p.speed, y: p.y + Math.sin(p.angle) * p.speed,
    })).filter(p => {
      if (p.x < -100 || p.x > GAME_WIDTH + 100 || p.y < -100 || p.y > GAME_HEIGHT + 100) return false;
      if (p.owner === 'player') {
        const hitEnemy = nextEnemies.find(e => p.x < e.x + e.width && p.x + p.width > e.x && p.y < e.y + e.height && p.y + p.height > e.y);
        if (hitEnemy) {
          hitEnemy.health -= p.damage;
          audioService.playHit();
          nextFloats.push({ id: Math.random().toString(36).substr(2,9), x: hitEnemy.x + hitEnemy.width/2 - 12, y: hitEnemy.y - 10, text: `-${p.damage}`, color: '#ff5252', life: 1, vy: -1 });
          for (let i = 0; i < 4; i++) nextParticles.push({ x: p.x, y: p.y, vx: (Math.random()-.5)*7, vy: (Math.random()-.5)*7, life: 0.5, color: '#fbc02d', size: 2 });
          return false;
        }
      } else {
        if (p.x < nextPlayer.x + nextPlayer.width && p.x + p.width > nextPlayer.x && p.y < nextPlayer.y + nextPlayer.height && p.y + p.height > nextPlayer.y) {
          playerDamageTaken += p.damage; audioService.playHit(); return false;
        }
      }
      return true;
    });

    if (playerDamageTaken > 0) nextPlayer.health = Math.max(0, nextPlayer.health - playerDamageTaken);

    // Dead enemies
    const deadEnemies = nextEnemies.filter(e => e.health <= 0);
    const bossDefeated = deadEnemies.some(e => e.enemyType === 'boss');
    if (deadEnemies.length > 0) {
      audioService.playCoin();
      const goldGained = deadEnemies.reduce((sum, e) => sum + e.goldValue, 0);
      nextPlayer.gold += goldGained;
      nextGameState.score += deadEnemies.length * 100;
      deadEnemies.forEach(e => {
        nextFloats.push({ id: Math.random().toString(36).substr(2,9), x: e.x + e.width/2 - 14, y: e.y - 5, text: `+${e.goldValue}g`, color: '#fdd835', life: 1.2, vy: -0.8 });
        for (let i = 0; i < 10; i++) nextParticles.push({ x: e.x + e.width/2, y: e.y + e.height/2, vx: (Math.random()-.5)*12, vy: (Math.random()-.5)*12-2, life: 0.9, color: i%2===0?'#ef5350':'#fbc02d', size: 3+Math.random()*2 });
        delete enemyLegTimers.current[e.id];
      });
      nextEnemies = nextEnemies.filter(e => e.health > 0);
    }

    if (bossDefeated) {
      nextGameState.isBossFight = false;
      if (nextGameState.level === 4) nextGameState.isVictory = true;
      else { nextGameState.isKnighting = true; setKnightingTimer(0); }
      nextProjectiles = []; nextEnemies = [];
      for (let i = 0; i < 40; i++) nextParticles.push({ x: GAME_WIDTH/2, y: GAME_HEIGHT/2, vx: (Math.random()-.5)*20, vy: (Math.random()-.5)*20, life: 1, color: ['#fbc02d','#ef5350','#fff','#4caf50'][Math.floor(Math.random()*4)], size: 4 });
    }

    // Particles & floats
    nextParticles = nextParticles.map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, vy: p.vy + 0.15, life: p.life - 0.025 })).filter(p => p.life > 0);
    nextFloats = nextFloats.map(f => ({ ...f, y: f.y + f.vy, life: f.life - 0.022 })).filter(f => f.life > 0);

    // Player death
    if (nextPlayer.health <= 0) {
      if (!nextPlayer.isHorseback) {
        audioService.playCarriageBreak();
        for (let i = 0; i < 25; i++) nextParticles.push({ x: nextPlayer.x + nextPlayer.width/2, y: nextPlayer.y + nextPlayer.height/2, vx: (Math.random()-.5)*14, vy: (Math.random()-.5)*14-2, life: 1, color: i%3===0?'#fbc02d':i%3===1?'#8d6e63':'#ef5350', size: 3+Math.random()*3 });
        nextScenery.push({ id: 'wrecked-'+Date.now(), x: nextPlayer.x, y: nextPlayer.y, type: 'wrecked_carriage', speed: 2, scale: 1 });
        nextFloats.push({ id: 'hb', x: nextPlayer.x-20, y: nextPlayer.y-30, text: 'On horseback!', color: '#fff', life: 2, vy: -0.5 });
        nextPlayer.isHorseback = true;
        nextPlayer.health = nextPlayer.maxHealth * 0.6;
        nextPlayer.width = HORSE_WIDTH;
        nextPlayer.height = HORSE_HEIGHT;
        nextPlayer.speed += 1;
      } else {
        nextGameState.isGameOver = true;
      }
    }

    // Spawn scenery
    let finalSceneryTimer = sceneryTimer + dt;
    const sceneryProgress = nextGameState.distance / nextGameState.maxDistance;
    const sceneryRate = sceneryProgress > 0.7 ? 800 : 1500;
    if (finalSceneryTimer > sceneryRate) {
      nextScenery.push(createScenery(nextGameState.distance, nextGameState.maxDistance, nextGameState.level, nextScenery));
      finalSceneryTimer = 0;
    }
    setSceneryTimer(finalSceneryTimer);

    // Spawn enemies
    let finalSpawnTimer = spawnTimer + dt;
    if (nextGameState.isBossFight) {
      if (!nextEnemies.some(e => e.enemyType === 'boss')) nextEnemies.push(createBoss(nextGameState.level));
      if (finalSpawnTimer > 4000) {
        for (let i = 0; i < 2; i++) { const m = createEnemy(nextGameState.level); m.enemyType = 'robber'; nextEnemies.push(m); }
        finalSpawnTimer = 0;
      }
    } else if (finalSpawnTimer > 3000 - (nextGameState.level * 200)) {
      nextEnemies.push(createEnemy(nextGameState.level));
      finalSpawnTimer = 0;
    }
    setSpawnTimer(finalSpawnTimer);

    setPlayer(nextPlayer);
    setEnemies(nextEnemies);
    setProjectiles(nextProjectiles);
    setGameState(nextGameState);
    setScenery(nextScenery);
    setParticles(nextParticles);
    setFloatTexts(nextFloats);
  }, [gameState, player, enemies, projectiles, scenery, particles, floatTexts, swordSwing, sceneryTimer, spawnTimer]);

  // ─── DRAW ──────────────────────────────────────────────────────────────────
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Sky
    const skyGrad = ctx.createLinearGradient(0, 0, 0, PLAYER_START_Y - 20);
    skyGrad.addColorStop(0, '#87ceeb'); skyGrad.addColorStop(1, '#b8e4f7');
    ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, GAME_WIDTH, PLAYER_START_Y - 20);

    // Rolling hills
    ctx.fillStyle = '#a5d6a7';
    ctx.beginPath(); ctx.moveTo(0, PLAYER_START_Y - 20);
    for (let i = 0; i <= GAME_WIDTH; i += 60)
      ctx.lineTo(i, PLAYER_START_Y - 50 - Math.sin(i * 0.015 + gameState.distance * 0.001) * 28);
    ctx.lineTo(GAME_WIDTH, PLAYER_START_Y - 20); ctx.fill();

    // Mountains (behind hills)
    scenery.filter(s => s.type === 'mountain').forEach(s => {
      ctx.fillStyle = '#90a4ae';
      ctx.beginPath();
      ctx.moveTo(s.x, s.y + 60 * s.scale); ctx.lineTo(s.x + 100 * s.scale, s.y + 60 * s.scale); ctx.lineTo(s.x + 50 * s.scale, s.y - 30 * s.scale); ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(s.x + 35 * s.scale, s.y - 5 * s.scale); ctx.lineTo(s.x + 65 * s.scale, s.y - 5 * s.scale); ctx.lineTo(s.x + 50 * s.scale, s.y - 30 * s.scale); ctx.fill();
    });

    // Grass
    ctx.fillStyle = '#7cb342'; ctx.fillRect(0, PLAYER_START_Y - 20, GAME_WIDTH, GAME_HEIGHT - (PLAYER_START_Y - 20));
    ctx.fillStyle = '#689f38';
    for (let i = 0; i < 60; i++) {
      const gx = ((Math.sin(i * 123.45) * 0.5 + 0.5) * GAME_WIDTH + gameState.distance * 0.5) % GAME_WIDTH;
      const gy = (Math.cos(i * 678.90) * 0.5 + 0.5) * GAME_HEIGHT;
      if (gy < PLAYER_START_Y - 25 || gy > PLAYER_START_Y + 80) { ctx.fillRect(gx, gy, 2, 6); ctx.fillRect(gx + 3, gy - 2, 2, 5); }
    }

    // Road
    const roadGradient = ctx.createLinearGradient(0, PLAYER_START_Y - 20, 0, PLAYER_START_Y + 80);
    roadGradient.addColorStop(0, '#8d6e63'); roadGradient.addColorStop(0.5, '#a1887f'); roadGradient.addColorStop(1, '#8d6e63');
    ctx.fillStyle = roadGradient; ctx.fillRect(0, PLAYER_START_Y - 20, GAME_WIDTH, 100);
    // Wheel ruts (scroll left)
    ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = 3;
    ctx.setLineDash([20, 15]); ctx.lineDashOffset = gameState.distance * 0.8 % 35;
    ctx.beginPath(); ctx.moveTo(0, PLAYER_START_Y + 18); ctx.lineTo(GAME_WIDTH, PLAYER_START_Y + 18); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, PLAYER_START_Y + 38); ctx.lineTo(GAME_WIDTH, PLAYER_START_Y + 38); ctx.stroke();
    ctx.setLineDash([]);
    // Road stones
    ctx.fillStyle = 'rgba(0,0,0,0.07)';
    for (let i = 0; i < 20; i++) {
      const sx = ((Math.sin(i * 456.78) * 0.5 + 0.5) * GAME_WIDTH + gameState.distance * 0.5) % GAME_WIDTH;
      const sy = PLAYER_START_Y + (Math.cos(i * 123.45) * 0.5 + 0.5) * 80;
      ctx.beginPath(); ctx.ellipse(sx, sy, 6, 3, i * 0.5, 0, Math.PI * 2); ctx.fill();
    }

    // Scenery objects
    scenery.filter(s => s.type !== 'mountain').forEach(s => {
      if (s.type === 'tree') {
        // y = base of trunk
        const trunkGrad = ctx.createLinearGradient(s.x + 10 * s.scale, 0, s.x + 20 * s.scale, 0);
        trunkGrad.addColorStop(0, '#5d4037'); trunkGrad.addColorStop(0.5, '#795548'); trunkGrad.addColorStop(1, '#5d4037');
        ctx.fillStyle = trunkGrad;
        ctx.fillRect(s.x + 10 * s.scale, s.y - 28 * s.scale, 10 * s.scale, 28 * s.scale);
        ctx.fillStyle = '#1b5e20'; ctx.beginPath(); ctx.arc(s.x + 15 * s.scale, s.y - 32 * s.scale, 22 * s.scale, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#2e7d32'; ctx.beginPath(); ctx.arc(s.x + 15 * s.scale, s.y - 40 * s.scale, 16 * s.scale, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#388e3c'; ctx.beginPath(); ctx.arc(s.x + 15 * s.scale, s.y - 47 * s.scale, 10 * s.scale, 0, Math.PI * 2); ctx.fill();
      } else if (s.type === 'house') {
        // y = base of house
        const hh = 32 * s.scale, hw = 44 * s.scale;
        ctx.fillStyle = '#bcaaa4'; ctx.fillRect(s.x, s.y - hh, hw, hh);
        ctx.fillStyle = '#4e342e';
        ctx.beginPath(); ctx.moveTo(s.x - 6 * s.scale, s.y - hh); ctx.lineTo(s.x + hw + 6 * s.scale, s.y - hh); ctx.lineTo(s.x + hw/2, s.y - hh - 22 * s.scale); ctx.fill();
        ctx.fillStyle = '#5d4037'; ctx.fillRect(s.x + 30 * s.scale, s.y - hh - 28 * s.scale, 6 * s.scale, 14 * s.scale);
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = `rgba(200,200,200,${0.3 - i * 0.08})`;
          ctx.beginPath(); ctx.arc(s.x + 33 * s.scale, s.y - hh - 32 * s.scale - i * 7 * s.scale, (3 + i * 2) * s.scale, 0, Math.PI * 2); ctx.fill();
        }
        ctx.fillStyle = '#5d4037'; ctx.beginPath(); ctx.roundRect(s.x + 16 * s.scale, s.y - 18 * s.scale, 12 * s.scale, 18 * s.scale, 2 * s.scale); ctx.fill();
        ctx.fillStyle = '#fff9c4';
        ctx.fillRect(s.x + 4 * s.scale, s.y - hh + 6 * s.scale, 10 * s.scale, 10 * s.scale);
        ctx.fillRect(s.x + 30 * s.scale, s.y - hh + 6 * s.scale, 10 * s.scale, 10 * s.scale);
        ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.x + 9 * s.scale, s.y - hh + 6 * s.scale); ctx.lineTo(s.x + 9 * s.scale, s.y - hh + 16 * s.scale);
        ctx.moveTo(s.x + 4 * s.scale, s.y - hh + 11 * s.scale); ctx.lineTo(s.x + 14 * s.scale, s.y - hh + 11 * s.scale);
        ctx.stroke();
      } else if (s.type === 'stream') {
        const sg = ctx.createLinearGradient(s.x, 0, s.x + 100, 0);
        sg.addColorStop(0, '#4fc3f7'); sg.addColorStop(0.5, '#81d4fa'); sg.addColorStop(1, '#4fc3f7');
        ctx.fillStyle = sg; ctx.beginPath(); ctx.roundRect(s.x, s.y, 100 * s.scale, 14 * s.scale, 5); ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 2;
        for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(s.x + 10 + i*30, s.y + 4); ctx.quadraticCurveTo(s.x + 20 + i*30, s.y + 9, s.x + 30 + i*30, s.y + 4); ctx.stroke(); }
      } else if (s.type === 'side_road') {
        ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.beginPath(); ctx.roundRect(s.x, s.y, 120 * s.scale, 8 * s.scale, 4); ctx.fill();
      } else if (s.type === 'castle') {
        // y = ground level, castle builds upward
        ctx.save(); ctx.translate(s.x, s.y); ctx.scale(s.scale, s.scale);
        ctx.fillStyle = '#78909c'; ctx.fillRect(0, -70, 60, 70);
        for (let i = 0; i < 5; i++) { ctx.fillStyle = '#607d8b'; ctx.fillRect(i * 13, -82, 9, 12); }
        ctx.fillStyle = '#546e7a'; ctx.fillRect(-18, -85, 22, 85); ctx.fillRect(56, -85, 22, 85);
        for (let i = 0; i < 3; i++) { ctx.fillStyle = '#455a64'; ctx.fillRect(-18 + i*8, -94, 5, 10); ctx.fillRect(56 + i*8, -94, 5, 10); }
        ctx.fillStyle = '#b71c1c';
        ctx.beginPath(); ctx.moveTo(-22, -85); ctx.lineTo(8, -85); ctx.lineTo(-7, -112); ctx.fill();
        ctx.beginPath(); ctx.moveTo(54, -85); ctx.lineTo(82, -85); ctx.lineTo(68, -112); ctx.fill();
        ctx.fillStyle = '#3e2723'; ctx.beginPath(); ctx.roundRect(18, -35, 24, 35, [12,12,0,0]); ctx.fill();
        ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(20 + i*7, -35); ctx.lineTo(20 + i*7, 0); ctx.stroke(); }
        ctx.beginPath(); ctx.moveTo(18, -20); ctx.lineTo(42, -20); ctx.moveTo(18, -10); ctx.lineTo(42, -10); ctx.stroke();
        ctx.fillStyle = '#fdd835';
        ctx.beginPath(); ctx.arc(8, -52, 6, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(52, -52, 6, 0, Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#8d6e63'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(30, -70); ctx.lineTo(30, -90); ctx.stroke();
        ctx.fillStyle = '#ef5350'; ctx.beginPath(); ctx.moveTo(30, -90); ctx.lineTo(44, -85); ctx.lineTo(30, -80); ctx.fill();
        ctx.restore();
      } else if (s.type === 'wrecked_carriage') {
        ctx.save(); ctx.translate(s.x, s.y); ctx.rotate(0.15);
        ctx.fillStyle = '#4e342e'; ctx.beginPath(); ctx.roundRect(0, 10, CARRIAGE_WIDTH, CARRIAGE_HEIGHT - 20, 10); ctx.fill();
        ctx.fillStyle = '#3e2723'; ctx.beginPath(); ctx.moveTo(-5, 15); ctx.lineTo(CARRIAGE_WIDTH + 5, 15); ctx.lineTo(CARRIAGE_WIDTH - 10, 0); ctx.lineTo(10, 0); ctx.fill();
        ctx.strokeStyle = '#3e2723'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(-10, CARRIAGE_HEIGHT - 10, 15, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(CARRIAGE_WIDTH + 10, CARRIAGE_HEIGHT - 5, 15, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
    });

    // ── Player ──
    ctx.save();
    ctx.translate(player.x, player.y);

    if (player.isHorseback) {
      // Horse ALWAYS faces right — never flips
      const legOffset = Math.sin(gameState.distance * 0.12) * 10;
      ctx.fillStyle = '#4e342e';
      ctx.beginPath(); ctx.roundRect(0, 10, 62, 36, 14); ctx.fill();
      ctx.beginPath(); ctx.moveTo(52, 16); ctx.lineTo(76, -4); ctx.lineTo(86, 6); ctx.lineTo(62, 28); ctx.fill();
      ctx.fillStyle = '#3e2723'; ctx.beginPath(); ctx.arc(78, 1, 2, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 2;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.moveTo(52+i*4,12+i*3); ctx.quadraticCurveTo(54+i*4,4+i*3,56+i*4,14+i*3); ctx.stroke(); }
      ctx.lineWidth = 4; ctx.strokeStyle = '#3e2723'; ctx.lineCap = 'round';
      [[10,46,legOffset],[20,46,-legOffset],[40,46,legOffset],[50,46,-legOffset]].forEach(([bx,by,lo]) => {
        ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx+lo,by+14); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx+lo,by+14); ctx.lineTo(bx+lo+8,by+14); ctx.stroke();
      });
      ctx.strokeStyle = '#1a1a1a'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(0,18); ctx.bezierCurveTo(-18,8,-22,26,-7,34); ctx.stroke();

      // Riders flip with player.facing independently
      ctx.save();
      if (player.facing === -1) { ctx.translate(player.width, 0); ctx.scale(-1, 1); }
      ctx.fillStyle = '#2e7d32'; ctx.beginPath(); ctx.roundRect(16, -18, 20, 28, 5); ctx.fill();
      ctx.fillStyle = '#ffe0b2'; ctx.fillRect(21, -28, 10, 12);
      ctx.fillStyle = '#3e2723'; ctx.fillRect(18, -32, 14, 5);
      ctx.fillStyle = '#e91e8c'; ctx.beginPath(); ctx.roundRect(40, -12, 16, 26, 5); ctx.fill();
      ctx.fillStyle = '#ffe0b2'; ctx.fillRect(43, -20, 10, 10);
      ctx.fillStyle = '#fdd835'; ctx.fillRect(42, -24, 12, 6);
      ctx.fillStyle = '#fbc02d';
      ctx.beginPath(); ctx.moveTo(42,-24); ctx.lineTo(45,-30); ctx.lineTo(48,-24); ctx.lineTo(51,-30); ctx.lineTo(54,-24); ctx.fill();
      ctx.restore();
    } else {
      // Carriage — horse ALWAYS faces right
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath(); ctx.ellipse(player.width/2, player.height+10, player.width/2+10, 10, 0, 0, Math.PI*2); ctx.fill();

      // Horse (no flip)
      ctx.save(); ctx.translate(player.width + 10, 10);
      ctx.fillStyle = '#5d4037';
      ctx.beginPath(); ctx.roundRect(0, 0, 50, 30, 10); ctx.fill();
      ctx.beginPath(); ctx.moveTo(40,5); ctx.lineTo(60,-10); ctx.lineTo(70,0); ctx.lineTo(50,20); ctx.fill();
      ctx.fillStyle = '#000000'; ctx.beginPath(); ctx.arc(63,-2,1.5,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#5d4037';
      ctx.beginPath(); ctx.moveTo(55,-8); ctx.lineTo(58,-15); ctx.lineTo(62,-10); ctx.fill();
      const legOffset2 = Math.sin(gameState.distance * 0.1) * 8;
      ctx.lineWidth = 3; ctx.strokeStyle = '#3e2723'; ctx.lineCap = 'round';
      [[10,30,legOffset2],[20,30,-legOffset2],[35,30,legOffset2],[45,30,-legOffset2]].forEach(([bx,by,lo]) => {
        ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx+lo,by+14); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(bx+lo,by+14); ctx.lineTo(bx+lo+8,by+14); ctx.stroke();
      });
      ctx.strokeStyle = '#212121'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(-10,10); ctx.lineTo(10,10); ctx.stroke();
      ctx.restore();

      // Carriage body (flips with facing)
      ctx.save();
      if (player.facing === -1) { ctx.translate(player.width, 0); ctx.scale(-1, 1); }

      const carriageGrad = ctx.createLinearGradient(0, 0, 0, player.height);
      carriageGrad.addColorStop(0, '#795548'); carriageGrad.addColorStop(1, '#4e342e');
      ctx.fillStyle = carriageGrad;
      ctx.beginPath(); ctx.roundRect(0, 0, player.width, player.height - 10, 10); ctx.fill();
      ctx.strokeStyle = '#fdd835'; ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, player.width - 20, player.height - 30);
      ctx.fillStyle = '#3e2723';
      ctx.beginPath(); ctx.moveTo(-10,5); ctx.lineTo(player.width+10,5); ctx.lineTo(player.width,-15); ctx.lineTo(0,-15); ctx.fill();
      ctx.strokeStyle = '#fbc02d'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0,-15); ctx.lineTo(player.width,-15); ctx.stroke();
      // Lantern
      ctx.fillStyle = '#fdd835'; ctx.beginPath(); ctx.roundRect(-6,-10,8,12,2); ctx.fill();
      ctx.fillStyle = 'rgba(255,220,0,0.25)'; ctx.beginPath(); ctx.arc(-2,0,7,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = '#bbdefb';
      ctx.beginPath(); ctx.roundRect(22,16,22,22,3); ctx.fill();
      ctx.beginPath(); ctx.roundRect(player.width-44,16,22,22,3); ctx.fill();
      ctx.strokeStyle = '#5d4037'; ctx.lineWidth = 1.5;
      ctx.strokeRect(22,16,22,22); ctx.strokeRect(player.width-44,16,22,22);
      ctx.fillStyle = '#ffe0b2'; ctx.fillRect(player.width-40,18,15,15);
      ctx.fillStyle = '#2e7d32'; ctx.fillRect(player.width-44,14,20,5);
      ctx.fillStyle = '#ffe0b2'; ctx.fillRect(28,18,15,15);
      ctx.fillStyle = '#fbc02d'; ctx.fillRect(30,14,10,4);
      const wheelRotation = gameState.distance * 0.05;
      const drawWheel = (x: number, y: number) => {
        ctx.save(); ctx.translate(x,y); ctx.rotate(wheelRotation);
        ctx.strokeStyle = '#3e2723'; ctx.lineWidth = 4;
        ctx.beginPath(); ctx.arc(0,0,18,0,Math.PI*2); ctx.stroke();
        ctx.fillStyle = '#5d4037'; ctx.beginPath(); ctx.arc(0,0,5,0,Math.PI*2); ctx.fill();
        ctx.lineWidth = 3;
        for (let i=0;i<8;i++) { ctx.rotate(Math.PI/4); ctx.beginPath(); ctx.moveTo(5,0); ctx.lineTo(18,0); ctx.stroke(); }
        ctx.restore();
      };
      drawWheel(30, player.height + 5);
      drawWheel(player.width - 30, player.height + 5);
      ctx.restore();
    }
    ctx.restore();

    // ── Enemies ──
    enemies.forEach(enemy => {
      if (enemy.enemyType === 'boss') {
        const warnT = (enemy.chargeTimer || 0) > 6000 && (enemy.chargeTimer || 0) < 8000 && !enemy.isCharging ? 1 : 0;
        drawBossCharacter(ctx, enemy, player.x, warnT);
        // Boss HP bar
        ctx.save(); ctx.translate(enemy.x, enemy.y - 22);
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0,0,enemy.width,8);
        ctx.fillStyle = '#fbc02d'; ctx.fillRect(0,0,(enemy.health/enemy.maxHealth)*enemy.width,8);
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.5; ctx.strokeRect(0,0,enemy.width,8);
        ctx.restore();
        return;
      }
      const facing = enemy.x < player.x ? 1 : -1;
      const legT = enemyLegTimers.current[enemy.id] || 0;
      drawHumanoid(ctx, enemy.x, enemy.y, facing, legT, enemy.attackTimer, enemy.enemyType as 'robber' | 'archer');
      // HP bar
      ctx.save(); ctx.translate(enemy.x, enemy.y - 10);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,0,enemy.width,5);
      ctx.fillStyle = '#ef5350'; ctx.fillRect(0,0,(enemy.health/enemy.maxHealth)*enemy.width,5);
      ctx.restore();
    });

    // ── Projectiles ──
    projectiles.forEach(p => {
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.angle);
      if (p.owner === 'player') {
        ctx.strokeStyle = '#795548'; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(-25,0); ctx.lineTo(10,0); ctx.stroke();
        ctx.fillStyle = '#9e9e9e'; ctx.beginPath(); ctx.moveTo(10,0); ctx.lineTo(0,-4); ctx.lineTo(0,4); ctx.fill();
        ctx.fillStyle = '#fff'; ctx.fillRect(-25,-4,8,8);
      } else {
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0,0,5,0,Math.PI*2); ctx.fill();
        ctx.strokeStyle = '#ff1744'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0,0,8,0,Math.PI*2); ctx.stroke();
      }
      ctx.restore();
    });

    // ── Particles ──
    particles.forEach(p => {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.size || 3, 0, Math.PI*2); ctx.fill();
    });
    ctx.globalAlpha = 1;

    // ── Float texts ──
    floatTexts.forEach(f => {
      ctx.globalAlpha = Math.max(0, f.life);
      ctx.font = 'bold 13px Georgia';
      ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 3;
      ctx.strokeText(f.text, f.x, f.y);
      ctx.fillStyle = f.color; ctx.fillText(f.text, f.x, f.y);
    });
    ctx.globalAlpha = 1;

    // ── Sword swing ──
    if (swordSwing > 0) {
      ctx.save();
      const progress = (15 - swordSwing) / 15;
      const swingAngle = player.facing === 1 ? -Math.PI/2 + progress * Math.PI : Math.PI/2 + progress * Math.PI;
      ctx.translate(player.facing === 1 ? player.x + player.width : player.x, player.y + player.height/2);
      ctx.rotate(swingAngle);
      ctx.fillStyle = '#e0e0e0'; ctx.strokeStyle = '#9e9e9e'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(60,-5); ctx.lineTo(70,0); ctx.lineTo(60,5); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#5d4037'; ctx.fillRect(-10,-2,15,4);
      ctx.fillStyle = '#fbc02d'; ctx.fillRect(-2,-10,4,20);
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = `rgba(255,255,255,${swordSwing/30})`; ctx.lineWidth = 15;
      ctx.beginPath(); ctx.arc(player.facing===1?player.x+player.width:player.x, player.y+player.height/2, 60, player.facing===1?-Math.PI/2:Math.PI/2, swingAngle); ctx.stroke();
      ctx.restore();
    }

    // ── Knighting scene ──
    if (gameState.isKnighting) {
      ctx.fillStyle = 'rgba(0,0,0,0.82)'; ctx.fillRect(0,0,GAME_WIDTH,GAME_HEIGHT);
      const cx = GAME_WIDTH/2, cy = GAME_HEIGHT/2;
      ctx.fillStyle = `rgba(255,150,30,${0.06+Math.sin(Date.now()*0.004)*0.02})`;
      ctx.beginPath(); ctx.arc(cx,cy,220,0,Math.PI*2); ctx.fill();
      ctx.save(); ctx.translate(cx-70,cy+30);
      ctx.fillStyle = '#4a7c59'; ctx.beginPath(); ctx.roundRect(0,0,40,30,5); ctx.fill();
      ctx.fillStyle = '#ffe0b2'; ctx.fillRect(8,-18,20,18);
      ctx.fillStyle = '#3e2723'; ctx.fillRect(6,-22,22,6);
      ctx.fillStyle = '#37474f'; ctx.beginPath(); ctx.roundRect(4,22,14,16,3); ctx.fill(); ctx.beginPath(); ctx.roundRect(14,30,14,10,3); ctx.fill();
      ctx.restore();
      ctx.save(); ctx.translate(cx+30,cy-10);
      ctx.fillStyle = '#4527a0'; ctx.beginPath(); ctx.roundRect(0,0,48,72,8); ctx.fill();
      ctx.strokeStyle = '#fbc02d'; ctx.lineWidth = 2; ctx.strokeRect(4,4,40,64);
      ctx.fillStyle = '#ffe0b2'; ctx.fillRect(14,-22,22,22);
      ctx.fillStyle = '#ffd700'; ctx.beginPath(); ctx.moveTo(12,-22); ctx.lineTo(12,-36); ctx.lineTo(18,-28); ctx.lineTo(25,-36); ctx.lineTo(32,-28); ctx.lineTo(36,-36); ctx.lineTo(36,-22); ctx.fill();
      ctx.fillStyle = '#e53935'; ctx.beginPath(); ctx.arc(25,-34,3,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#e0e0e0'; ctx.lineWidth = 5; ctx.lineCap = 'round';
      if (knightingTimer < 1500) { ctx.beginPath(); ctx.moveTo(4,32); ctx.lineTo(-90,50); ctx.stroke(); }
      else if (knightingTimer < 3000) { ctx.beginPath(); ctx.moveTo(4,32); ctx.lineTo(-80,48); ctx.stroke(); }
      else { ctx.beginPath(); ctx.moveTo(4,32); ctx.lineTo(-12,-55); ctx.stroke(); }
      ctx.fillStyle = '#ffd700'; ctx.fillRect(-1,22,10,20);
      ctx.restore();
      ctx.textAlign = 'center';
      let title = 'Courier of the Realm';
      if (gameState.level === 3) title = 'Lord Protector of the Realm';
      else if (gameState.level === 2) title = 'Knight of the Realm';
      ctx.font = 'bold 26px Georgia'; ctx.fillStyle = '#ffd700';
      ctx.fillText(`I knight thee, ${title}!`, cx, cy + 130);
      ctx.font = '15px Georgia'; ctx.fillStyle = 'rgba(255,255,255,0.7)';
      ctx.fillText('For bravery in the face of the Great Ambush.', cx, cy + 158);
      ctx.textAlign = 'left';
    }
  }, [player, enemies, projectiles, particles, floatTexts, scenery, gameState.distance, swordSwing, gameState.isKnighting, knightingTimer]);

  useEffect(() => { updateRef.current = update; }, [update]);
  useEffect(() => { drawRef.current = draw; }, [draw]);

  const loop = useCallback((time: number) => {
    const deltaTime = time - lastTime;
    setLastTime(time);
    if (updateRef.current) updateRef.current(deltaTime);
    const canvas = canvasRef.current;
    if (canvas) { const ctx = canvas.getContext('2d'); if (ctx && drawRef.current) drawRef.current(ctx); }
    requestRef.current = requestAnimationFrame(loop);
  }, [lastTime]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => { if (requestRef.current) cancelAnimationFrame(requestRef.current); };
  }, [loop]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState.isPaused || gameState.isGameOver || gameState.isShopOpen) return;
    pendingActions.current.shoot = true;
  };

  const restartGame = () => {
    audioService.playClick();
    setGameState({ distance:0, maxDistance:3500, isGameOver:false, isPaused:false, isShopOpen:false, isBossFight:false, isKnighting:false, isCinematic:false, isVictory:false, hasStarted:true, score:0, level:1 });
    setPlayer({ id:'player', x:PLAYER_START_X, y:PLAYER_START_Y, width:CARRIAGE_WIDTH, height:CARRIAGE_HEIGHT, health:100, maxHealth:100, type:'player', speed:2, gold:0, weaponLevel:1, bowLevel:1, armorLevel:1, horseLevel:1, isHorseback:false, ammo:10, maxAmmo:10, reloadTimer:0, facing:1 });
    setEnemies([]); setProjectiles([]); setParticles([]); setScenery([]); setFloatTexts([]);
  };

  const upgrade = (type: 'weapon' | 'bow' | 'armor' | 'horse') => {
    const cost = 50 * (player[`${type}Level`] || 1);
    if (player.gold >= cost) {
      audioService.playUpgrade();
      setPlayer(prev => ({ ...prev, gold: prev.gold - cost, [`${type}Level`]: (prev[`${type}Level`] || 1) + 1, maxHealth: type==='armor'?prev.maxHealth+20:prev.maxHealth, health: type==='armor'?prev.health+20:prev.health, speed: type==='horse'?prev.speed+0.5:prev.speed }));
    }
  };

  const reloadProgress = player.ammo >= player.maxAmmo ? 1 : player.reloadTimer / Math.max(500, 4000 - (player.bowLevel - 1) * 500);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-0 lg:p-4 bg-[#f5f5f0] font-serif overflow-hidden">
      {isTouchDevice && (
        <div className="fixed inset-0 z-[100] bg-black text-white flex-col items-center justify-center p-8 text-center hidden portrait:flex">
          <RotateCcw className="w-16 h-16 mb-4 animate-[spin_3s_linear_infinite]" />
          <h2 className="text-2xl font-bold mb-2">Please Rotate Your Device</h2>
          <p className="text-white/70">This game is best played in landscape mode.</p>
        </div>
      )}

      <div className="relative w-full h-[100dvh] lg:h-auto lg:max-w-[1000px] lg:aspect-[2/1] bg-black lg:rounded-xl overflow-hidden shadow-2xl border-0 lg:border-4 border-[#5A5A40]">
        <canvas
          ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT}
          onClick={handleCanvasClick}
          onTouchStart={(e) => { touchState.current.active=true; touchState.current.startX=e.touches[0].clientX; touchState.current.startY=e.touches[0].clientY; touchState.current.currentX=e.touches[0].clientX; touchState.current.currentY=e.touches[0].clientY; }}
          onTouchMove={(e) => { if(!touchState.current.active)return; touchState.current.currentX=e.touches[0].clientX; touchState.current.currentY=e.touches[0].clientY; }}
          onTouchEnd={() => { touchState.current.active=false; }}
          className="w-full h-full cursor-crosshair touch-none"
        />

        {/* Mobile Controls */}
        {isTouchDevice && gameState.hasStarted && !gameState.isGameOver && !gameState.isVictory && !gameState.isShopOpen && !gameState.isCinematic && !gameState.isKnighting && (
          <>
            <div className="absolute bottom-4 left-4 z-40">
              <button className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/50 flex items-center justify-center active:bg-white/40 touch-none" onTouchStart={(e) => { e.preventDefault(); pendingActions.current.shoot=true; }}>
                <Crosshair className="w-8 h-8 text-white" />
              </button>
            </div>
            <div className="absolute bottom-4 right-4 z-40">
              <button className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/50 flex items-center justify-center active:bg-white/40 touch-none" onTouchStart={(e) => { e.preventDefault(); pendingActions.current.sword=true; }}>
                <Sword className="w-8 h-8 text-white" />
              </button>
            </div>
          </>
        )}

        {/* HUD */}
        <div className="absolute top-0 left-0 w-full p-3 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 bg-black/60 px-2 py-1.5 rounded-lg border border-white/10">
              <Heart className="text-red-500 w-4 h-4" />
              <div className="w-28 h-2.5 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 transition-all duration-100" style={{ width: `${(player.health/player.maxHealth)*100}%` }} />
              </div>
              <span className="text-white text-xs font-mono">{Math.ceil(player.health)}/{player.maxHealth}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/60 px-2 py-1.5 rounded-lg border border-white/10">
              <Crosshair className="text-yellow-500 w-4 h-4" />
              <div className="w-28 h-2.5 bg-gray-700 rounded-full overflow-hidden relative">
                <div className="h-full bg-yellow-500" style={{ width: `${(player.ammo/player.maxAmmo)*100}%` }} />
                {player.ammo < player.maxAmmo && (
                  <div className="absolute top-0 left-0 h-full bg-yellow-300/40" style={{ width: `${reloadProgress*100}%` }} />
                )}
              </div>
              <span className="text-white text-xs font-mono">{player.ammo}/{player.maxAmmo}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <div className="flex flex-col items-end bg-black/60 px-2 py-1.5 rounded-lg border border-white/10">
              <div className="flex justify-between w-44 text-[9px] text-white/60 uppercase tracking-widest font-bold mb-1">
                <span>Kingdom Road</span><span>Level {gameState.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-blue-400 w-4 h-4" />
                <div className="w-44 h-2.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 transition-none" style={{ width: `${gameState.isShopOpen?100:(gameState.distance/gameState.maxDistance)*100}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-black/60 px-2 py-1.5 rounded-lg border border-white/10">
              <Coins className="text-yellow-400 w-4 h-4" />
              <span className="text-white font-bold text-sm">{player.gold}</span>
              <span className="text-white/50 text-xs ml-2">Score: {gameState.score}</span>
            </div>
          </div>
        </div>

        {/* Cinematic */}
        <AnimatePresence>
          {gameState.isCinematic && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-[#f5f5f0] flex flex-col items-center justify-center p-12 text-center">
              <motion.div initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.5}} className="max-w-xl">
                <div className="flex justify-center gap-4 mb-8">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-12 h-16 bg-[#4a7c59] rounded-t-lg mb-1" />
                      <div className="w-8 h-8 bg-[#ffe0b2] rounded-full -mt-20" />
                    </div>
                  ))}
                </div>
                <h2 className="text-2xl font-serif italic text-[#5A5A40] mb-6 leading-relaxed">
                  {gameState.level===4?"\"More enemy armies have invaded our peaceful kingdom. Please help us!\"":"\"Be safe on your return journey, brave courier! The evil warlord is pillaging the countryside with his minions.\""}
                </h2>
                <Button size="lg" onClick={() => setGameState(prev=>({...prev,isCinematic:false,isPaused:false}))} className="bg-[#5A5A40] hover:bg-[#4A4A30] text-white px-8 rounded-full">To the Road!</Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start Menu */}
        <AnimatePresence>
          {!gameState.hasStarted && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-md z-50">
              <h1 className="text-6xl text-white font-bold mb-8 tracking-tighter italic">Royal Courier</h1>
              <p className="text-white/70 mb-8 text-center max-w-md">The countryside is full of bandits. Our King commands you to protect the princess and bring her to our neighboring castle safely.</p>
              <p className="text-white/40 text-xs mb-8">
                <Badge variant="outline" className="text-white border-white">Q</Badge> sword &nbsp;
                <Badge variant="outline" className="text-white border-white">W</Badge> arrow &nbsp;
                <Badge variant="outline" className="text-white border-white">↑↓</Badge> move &nbsp;
                <Badge variant="outline" className="text-white border-white">Space</Badge> pause
              </p>
              <Button size="lg" onClick={() => setGameState(prev=>({...prev,isPaused:false,hasStarted:true}))} className="bg-[#5A5A40] hover:bg-[#4A4A30] text-white px-12 py-8 text-2xl rounded-full">
                <Play className="mr-2 fill-current" /> Start Journey
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause */}
        <AnimatePresence>
          {gameState.isPaused && gameState.hasStarted && !gameState.isGameOver && !gameState.isShopOpen && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] z-40">
              <h2 className="text-6xl text-white font-bold tracking-widest italic drop-shadow-2xl">PAUSED</h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over */}
        <AnimatePresence>
          {gameState.isGameOver && (
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} className="absolute inset-0 bg-red-950/90 flex flex-row items-center justify-center gap-16 backdrop-blur-xl p-12 overflow-y-auto">
              <div className="scale-[1.5] hidden lg:block"><KnightIllustration /></div>
              <div className="flex flex-col items-start max-w-md py-8">
                <h2 className="text-5xl text-white font-bold mb-4 italic">Ambushed!</h2>
                <p className="text-white/70 mb-8">The princess was captured by the robbers.</p>
                <div className="bg-white/10 p-6 rounded-2xl border border-white/20 mb-8 text-center w-full">
                  <p className="text-white/50 text-sm uppercase tracking-widest mb-1">Final Score</p>
                  <p className="text-4xl text-white font-bold">{gameState.score}</p>
                </div>
                <Button size="lg" onClick={restartGame} className="bg-white text-red-950 hover:bg-white/90 px-12 py-8 text-2xl rounded-full w-full">
                  <RotateCcw className="mr-2" /> Try Again
                </Button>
                <p className="text-white/30 text-xs mt-6">Created by Christopher Wu</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Victory */}
        <AnimatePresence>
          {gameState.isVictory && (
            <motion.div initial={{opacity:0}} animate={{opacity:1}} className="absolute inset-0 bg-yellow-500/95 flex flex-col items-center justify-start backdrop-blur-xl p-6 md:p-12 overflow-y-auto z-50">
              <div className="w-full max-w-6xl flex flex-col items-center py-12">
                <motion.h2 initial={{y:-50,opacity:0}} animate={{y:0,opacity:1}} className="text-6xl md:text-8xl text-white font-bold mb-16 italic drop-shadow-2xl text-center">Royal Victory!</motion.h2>
                <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12 mb-20">
                  <motion.div initial={{x:-50,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:0.2}} className="flex-1 text-left">
                    <p className="text-white text-2xl md:text-4xl font-serif italic leading-relaxed drop-shadow-md">"The king offers the princess's hand to you in marriage. You are now the heir to the throne!"</p>
                  </motion.div>
                  <motion.div initial={{x:50,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:0.4}} className="flex-1 flex justify-center lg:justify-end">
                    <div className="bg-white/20 p-8 md:p-12 rounded-[40px] border-2 border-white/40 text-center backdrop-blur-lg shadow-2xl min-w-[280px] md:min-w-[350px]">
                      <p className="text-white/80 text-sm md:text-base uppercase tracking-[0.3em] mb-4 font-bold">Legendary Score</p>
                      <p className="text-7xl md:text-9xl text-white font-black drop-shadow-lg">{gameState.score}</p>
                    </div>
                  </motion.div>
                </div>
                <motion.div initial={{scale:0.5,opacity:0}} animate={{scale:2.5,opacity:1}} transition={{delay:0.6,type:'spring'}} className="mb-24 mt-12"><KnightIllustration /></motion.div>
                <motion.div initial={{y:50,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:0.8}} className="w-full flex flex-col items-center">
                  <Button size="lg" onClick={restartGame} className="bg-white text-yellow-600 hover:bg-white/90 px-16 md:px-24 py-10 md:py-12 text-3xl md:text-4xl rounded-full shadow-2xl font-bold transition-all hover:scale-105 active:scale-95">
                    <RotateCcw className="mr-4 w-8 h-8 md:w-10 md:h-10" /> Play Again
                  </Button>
                  <p className="text-white/70 text-sm md:text-base mt-12 font-bold tracking-[0.4em] uppercase">Created by Christopher Wu</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shop */}
        <AnimatePresence>
          {gameState.isShopOpen && (
            <motion.div initial={{y:100,opacity:0}} animate={{y:0,opacity:1}} className="absolute inset-0 bg-[#f5f5f0] flex flex-col items-center justify-center p-8 overflow-y-auto">
              <div className="w-full max-w-2xl">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-4xl font-bold italic text-[#5A5A40]">Kingdom Outpost</h2>
                    <p className="text-muted-foreground">Rest and resupply for the next leg of the journey.</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Your Purse</p>
                    <div className="flex items-center gap-2 bg-[#5A5A40] text-white px-6 py-3 rounded-2xl shadow-inner">
                      <Coins className="w-6 h-6 text-yellow-400" />
                      <span className="font-bold text-2xl tracking-tighter">{player.gold}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <ShopItem icon={<Sword className="w-6 h-6"/>} title="Sword Mastery" level={player.weaponLevel} cost={50*player.weaponLevel} description="Increase close combat damage." onUpgrade={()=>upgrade('weapon')} canAfford={player.gold>=50*player.weaponLevel}/>
                  <ShopItem icon={<Crosshair className="w-6 h-6"/>} title="Bow Tuning" level={player.bowLevel} cost={50*player.bowLevel} description="Faster arrow reload speed." onUpgrade={()=>upgrade('bow')} canAfford={player.gold>=50*player.bowLevel}/>
                  <ShopItem icon={<Shield className="w-6 h-6"/>} title="Royal Armor" level={player.armorLevel} cost={50*player.armorLevel} description="Increase maximum health." onUpgrade={()=>upgrade('armor')} canAfford={player.gold>=50*player.armorLevel}/>
                  <ShopItem icon={<ArrowUp className="w-6 h-6"/>} title="Steed Training" level={player.horseLevel} cost={50*player.horseLevel} description="Increase travel speed." onUpgrade={()=>upgrade('horse')} canAfford={player.gold>=50*player.horseLevel}/>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4 text-center text-sm text-green-700">Full HP & ammo restored on departure</div>
                <Button className="w-full py-8 text-xl bg-[#5A5A40] hover:bg-[#4A4A30] text-white rounded-xl" onClick={() => { setGameState(prev=>({...prev,isShopOpen:false,isCinematic:true})); setPlayer(prev=>({...prev,health:prev.maxHealth,ammo:prev.maxAmmo})); setScenery([]); }}>
                  Continue Journey <ChevronRight className="ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Instructions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[800px]">
        <Card className="bg-white/50 border-none shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><User className="w-5 h-5 text-[#5A5A40]"/>The Mission</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">Protect the princess at all costs. If the carriage breaks, you must continue on horseback.</CardContent>
        </Card>
        <Card className="bg-white/50 border-none shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Sword className="w-5 h-5 text-[#5A5A40]"/>Combat</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <span className="font-bold text-[#5A5A40]">Q:</span> Sword swing.<br/>
            <span className="font-bold text-[#5A5A40]">W:</span> Shoot arrow.<br/>
            <span className="font-bold text-[#5A5A40]">Space:</span> Pause.
          </CardContent>
        </Card>
        <Card className="bg-white/50 border-none shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-lg flex items-center gap-2"><Coins className="w-5 h-5 text-[#5A5A40]"/>Upgrades</CardTitle></CardHeader>
          <CardContent className="text-sm text-muted-foreground">Collect gold from defeated robbers to upgrade your gear at outposts.</CardContent>
        </Card>
      </div>
    </div>
  );
}

function ShopItem({ icon, title, level, cost, description, onUpgrade, canAfford }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-[#5A5A40]/10 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-[#5A5A40]/10 rounded-lg text-[#5A5A40]">{icon}</div>
        <div><h3 className="font-bold text-sm">{title}</h3><Badge variant="secondary" className="text-[10px] h-4">LVL {level}</Badge></div>
      </div>
      <p className="text-xs text-muted-foreground mb-4 h-8">{description}</p>
      <Button variant={canAfford?"default":"outline"} disabled={!canAfford} onClick={onUpgrade} className={`w-full text-xs h-8 ${canAfford?'bg-[#5A5A40] hover:bg-[#4A4A30] text-white':''}`}>
        Upgrade ({cost} G)
      </Button>
    </div>
  );
}

function KnightIllustration() {
  return (
    <div className="relative w-40 h-32">
      <div className="absolute bottom-0 left-4 w-24 h-16 bg-white rounded-t-3xl border-2 border-gray-300 shadow-inner"/>
      <div className="absolute bottom-12 left-20 w-12 h-12 bg-white rounded-full border-2 border-gray-300"/>
      <div className="absolute bottom-16 left-28 w-8 h-4 bg-white rounded-full border-2 border-gray-300"/>
      <div className="absolute bottom-0 left-6 w-2 h-6 bg-gray-200"/>
      <div className="absolute bottom-0 left-12 w-2 h-6 bg-gray-200"/>
      <div className="absolute bottom-0 left-20 w-2 h-6 bg-gray-200"/>
      <div className="absolute bottom-14 left-8 w-16 h-20 bg-slate-200 rounded-t-xl border-2 border-slate-400 shadow-lg"/>
      <div className="absolute bottom-16 left-0 w-12 h-14 bg-yellow-500 rounded-b-full border-2 border-yellow-600 shadow-md flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-yellow-700 rounded-full"/>
      </div>
    </div>
  );
}
