import React, { useEffect, useRef, useState, useCallback } from 'react';

// Inline UI Components (Replacing shadcn/ui, lucide-react, and motion)
const Button = ({ className, size, ...props }: any) => (
  <button 
    className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background ${size === 'lg' ? 'h-11 px-8 rounded-md' : 'h-10 py-2 px-4'} ${className}`} 
    {...props} 
  />
);

const Card = ({ className, ...props }: any) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`} {...props} />
);
const CardHeader = ({ className, ...props }: any) => <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />;
const CardTitle = ({ className, ...props }: any) => <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`} {...props} />;
const CardDescription = ({ className, ...props }: any) => <p className={`text-sm text-muted-foreground ${className}`} {...props} />;
const CardContent = ({ className, ...props }: any) => <div className={`p-6 pt-0 ${className}`} {...props} />;

const Badge = ({ className, variant, ...props }: any) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variant === 'secondary' ? 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'border-transparent bg-primary text-primary-foreground hover:bg-primary/80'} ${className}`} {...props} />
);

const motion = {
  div: ({ children, className, style, ...props }: any) => <div className={className} style={style}>{children}</div>,
  h1: ({ children, className, style, ...props }: any) => <h1 className={className} style={style}>{children}</h1>,
  h2: ({ children, className, style, ...props }: any) => <h2 className={className} style={style}>{children}</h2>,
  p: ({ children, className, style, ...props }: any) => <p className={className} style={style}>{children}</p>,
  span: ({ children, className, style, ...props }: any) => <span className={className} style={style}>{children}</span>,
};
const AnimatePresence = ({ children }: any) => <>{children}</>;

const Confetti = () => {
  const [pieces, setPieces] = useState<any[]>([]);
  
  useEffect(() => {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];
    const newPieces = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 5 + Math.random() * 10
    }));
    setPieces(newPieces);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map(p => (
        <div 
          key={p.id}
          className="confetti"
          style={{ 
            left: `${p.left}%`, 
            animationDelay: `${p.delay}s`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px'
          }}
        />
      ))}
    </div>
  );
};

// Icons
const Shield = ({ className }: any) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const Sword = ({ className }: any) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="14.5 17.5 3 6 6 3 17.5 14.5"/><line x1="13" y1="19" x2="19" y2="13"/><line x1="16" y1="16" x2="20" y2="20"/><line x1="19" y1="21" x2="20" y2="20"/></svg>;
const ArrowUp = ({ className }: any) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>;
const Coins = ({ className }: any) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="8" r="6"/><path d="M18.09 10.37A6 6 0 1 1 10.34 18.06"/><path d="M7 6h1v4"/><path d="M17 16h1v4"/></svg>;
const MapPin = ({ className }: any) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const Heart = ({ className }: any) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const Crosshair = ({ className }: any) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>;
const Play = ({ className }: any) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const RotateCcw = ({ className }: any) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>;
const ShoppingBag = ({ className }: any) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>;
const ChevronRight = ({ className }: any) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const Package = ({ className }: any) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.6"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const User = ({ className }: any) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const Wind = ({ className }: any) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.7 7.7A7.1 7.1 0 1 1 5 8"/><path d="M9.6 4.6A9.6 9.6 0 0 1 22 11"/><path d="M7 16h10"/><path d="M13 20H9"/><path d="M15 12H9"/></svg>;
const Flame = ({ className }: any) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.5 4 6.5 2 2 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>;

import { audioService } from './lib/audio';
import { 
  GAME_WIDTH, 
  GAME_HEIGHT, 
  PLAYER_START_X, 
  PLAYER_START_Y, 
  CARRIAGE_WIDTH, 
  CARRIAGE_HEIGHT, 
  HORSE_WIDTH, 
  HORSE_HEIGHT, 
  ENEMY_WIDTH, 
  ENEMY_HEIGHT, 
  PROJECTILE_SIZE,
  COLORS 
} from './constants';
import { Player, Enemy, Projectile, GameState, Entity, SceneryObject, FloatText } from './types';

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // React state for UI/HUD only (synced every ~10 frames)
  const [hudState, setHudState] = useState({
    health: 100,
    maxHealth: 100,
    gold: 0,
    ammo: 10,
    maxAmmo: 10,
    reloadProgress: 0,
    distance: 0,
    maxDistance: 3500,
    level: 1,
    score: 0,
    weaponLevel: 1,
    bowLevel: 1,
    armorLevel: 1,
    horseLevel: 1,
    speed: 2
  });

  const [gameState, setGameState] = useState<GameState>({
    distance: 0,
    maxDistance: 3500,
    isGameOver: false,
    isPaused: true,
    isShopOpen: false,
    isBossFight: false,
    isKnighting: false,
    isCinematic: false,
    isVictory: false,
    hasStarted: false,
    score: 0,
    level: 1,
  });

  const [knightingTimer, setKnightingTimer] = useState(0);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Game Engine Refs (The "Real" State)
  const playerRef = useRef<Player>({
    id: 'player',
    x: PLAYER_START_X,
    y: PLAYER_START_Y,
    width: CARRIAGE_WIDTH,
    height: CARRIAGE_HEIGHT,
    health: 100,
    maxHealth: 100,
    type: 'player',
    speed: 2,
    gold: 0,
    weaponLevel: 1,
    bowLevel: 1,
    armorLevel: 1,
    horseLevel: 1,
    isHorseback: false,
    ammo: 10,
    maxAmmo: 10,
    reloadTimer: 0,
    facing: 1,
    animFrame: 0,
  });

  const enemiesRef = useRef<Enemy[]>([]);
  const projectilesRef = useRef<Projectile[]>([]);
  const sceneryRef = useRef<SceneryObject[]>([]);
  const particlesRef = useRef<any[]>([]);
  const floatTextsRef = useRef<FloatText[]>([]);
  const gameStateRef = useRef<GameState>(gameState);
  
  const lastTimeRef = useRef(0);
  const spawnTimerRef = useRef(0);
  const sceneryTimerRef = useRef(0);
  const swordSwingRef = useRef(0);
  const hudSyncTimerRef = useRef(0);

  const requestRef = useRef<number>(null);
  const updateRef = useRef<any>();
  const drawRef = useRef<any>();

  // Input state
  const keys = useRef<{ [key: string]: boolean }>({});
  const pendingActions = useRef({ shoot: false, sword: false });
  const touchState = useRef({ active: false, startX: 0, startY: 0, currentX: 0, currentY: 0 });

  // Sync ref with state for React UI
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

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
    const isPlaying = !gameState.isPaused && !gameState.isGameOver && !gameState.isShopOpen && !gameState.isKnighting && !gameState.isCinematic && !gameState.isVictory && gameState.hasStarted;
    
    if (!gameState.hasStarted) {
      audioService.startMenuMusic();
    } else {
      audioService.stopMenuMusic();
    }

    if (isPlaying) {
      audioService.startMusic(gameState.isBossFight);
      audioService.updateMusic(gameState.isBossFight);
    } else {
      audioService.stopMusic();
    }

    if (gameState.isVictory || gameState.isKnighting) {
      audioService.playFanfare();
    }

    if (gameState.isGameOver) {
      audioService.playSad();
    }

    if (gameState.isCinematic) {
      if (gameState.level === 4) {
        audioService.playOminous();
      } else {
        audioService.playCelebration();
      }
    }

    return () => {
      audioService.stopMusic();
      audioService.stopMenuMusic();
    };
  }, [gameState.isPaused, gameState.isGameOver, gameState.isShopOpen, gameState.isKnighting, gameState.isBossFight, gameState.isCinematic, gameState.isVictory, gameState.hasStarted, gameState.level]);

  const createScenery = (distance: number, maxDistance: number, level: number, currentScenery: SceneryObject[]) => {
    const progress = distance / maxDistance;
    const isNearEnd = progress > 0.5;
    const isVeryNearEnd = progress > 0.65;

    let types: ('tree' | 'house' | 'mountain' | 'stream' | 'side_road' | 'road_rut')[] = ['tree', 'house', 'mountain', 'stream', 'road_rut'];
    
    if (isNearEnd) {
      types = ['house', 'house', 'side_road', 'tree', 'mountain', 'road_rut'];
    }

    const hasCastle = currentScenery.some(s => s.type === 'castle');
    if (isVeryNearEnd && !hasCastle) {
      return {
        id: 'castle-' + level,
        x: GAME_WIDTH + 100,
        y: 80,
        type: 'castle',
        speed: 0.8,
        scale: 2.5,
      } as SceneryObject;
    }

    const type = types[Math.floor(Math.random() * types.length)];
    let y = 0;
    let speed = 0;
    let scale = 1;

    if (type === 'mountain') {
      y = 50 + Math.random() * 50;
      speed = 0.5;
      scale = 1.5 + Math.random() * 1;
    } else if (type === 'tree') {
      y = Math.random() > 0.5 ? 50 + Math.random() * 100 : 300 + Math.random() * 50;
      speed = 2;
      scale = 0.8 + Math.random() * 0.5;
    } else if (type === 'stream') {
      y = 250 + Math.random() * 100;
      speed = 2.5;
      scale = 1;
    } else if (type === 'side_road') {
      y = 120 + Math.random() * 40;
      speed = 2;
      scale = 1;
    } else if (type === 'road_rut') {
      y = PLAYER_START_Y + 10 + Math.random() * 60;
      speed = 2;
      scale = 0.5 + Math.random() * 0.5;
    } else {
      // House
      y = Math.random() > 0.5 ? 80 + Math.random() * 50 : 320 + Math.random() * 30;
      speed = 2;
      scale = 1;
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      x: GAME_WIDTH + 100,
      y,
      type,
      speed,
      scale,
    } as SceneryObject;
  };

  const createBoss = (level: number) => {
    return {
      id: 'boss-' + Math.random().toString(36).substr(2, 9),
      x: GAME_WIDTH + 100,
      y: GAME_HEIGHT / 2 + 20,
      width: 100,
      height: 100,
      health: 500 + level * 200,
      maxHealth: 500 + level * 200,
      type: 'enemy',
      enemyType: 'boss',
      speed: 1,
      attackTimer: 0,
      chargeTimer: 0,
      isCharging: false,
      damage: 15,
      goldValue: 600,
      spawnSide: 'right',
      animFrame: 0,
      isTelegraphing: false,
      telegraphTimer: 0,
    } as Enemy;
  };

  const createEnemy = (level: number) => {
    const type = Math.random() > 0.15 ? 'robber' : 'archer';
    const side = Math.random() > 0.5 ? 'left' : 'right';
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: side === 'right' ? GAME_WIDTH + 50 : -100,
      y: PLAYER_START_Y + (Math.random() * 100 - 50),
      width: ENEMY_WIDTH,
      height: ENEMY_HEIGHT,
      health: (type === 'robber' ? 24 : 20) + level * 10,
      maxHealth: (type === 'robber' ? 24 : 20) + level * 10,
      type: 'enemy',
      enemyType: type,
      speed: (type === 'robber' ? 2.5 : 1) + Math.random() * 1.5,
      attackTimer: 0,
      damage: (type === 'robber' ? 8 : 5) + level * 2,
      goldValue: type === 'robber' ? 35 : 20,
      spawnSide: side,
      animFrame: 0,
    } as Enemy;
  };

  const spawnFloatText = (x: number, y: number, text: string, color: string) => {
    floatTextsRef.current.push({
      id: Math.random().toString(36).substr(2, 9),
      x, y, text, color, opacity: 1, life: 1,
      width: 0, height: 0, health: 0, maxHealth: 0, type: 'float_text', speed: 1
    });
  };

  const update = useCallback((deltaTime: number) => {
    const dt = Math.min(deltaTime, 100);
    const gs = gameStateRef.current;
    
    // --- HUD Sync (Must happen even if game is paused/shop open) ---
    hudSyncTimerRef.current += 1;
    if (hudSyncTimerRef.current >= 10) {
      const reloadSpeed = Math.max(500, 4000 - (playerRef.current.bowLevel - 1) * 500);
      setHudState({
        health: playerRef.current.health,
        maxHealth: playerRef.current.maxHealth,
        gold: playerRef.current.gold,
        ammo: playerRef.current.ammo,
        maxAmmo: playerRef.current.maxAmmo,
        reloadProgress: playerRef.current.reloadTimer / reloadSpeed,
        distance: gs.distance,
        maxDistance: gs.maxDistance,
        level: gs.level,
        score: gs.score,
        weaponLevel: playerRef.current.weaponLevel,
        bowLevel: playerRef.current.bowLevel,
        armorLevel: playerRef.current.armorLevel,
        horseLevel: playerRef.current.horseLevel,
        speed: playerRef.current.speed
      });
      hudSyncTimerRef.current = 0;
    }

    if (gs.isPaused || gs.isGameOver || gs.isShopOpen || gs.isKnighting || gs.isVictory) {
      if (gs.isKnighting) {
        setKnightingTimer(prev => {
          const next = prev + dt;
          if (next > 5000) {
            const nextLevel = gs.level + 1;
            setGameState(prevGs => ({ ...prevGs, isKnighting: false, isShopOpen: true, distance: 0, level: nextLevel }));
            // Update ref immediately
            gs.isKnighting = false;
            gs.isShopOpen = true;
            gs.distance = 0;
            gs.level = nextLevel;
            sceneryRef.current = [];
            return 0;
          }
          return next;
        });
      }
      return;
    }

    // --- 1. State References ---
    const player = playerRef.current;
    const enemies = enemiesRef.current;
    const projectiles = projectilesRef.current;
    const scenery = sceneryRef.current;
    const particles = particlesRef.current;
    const floatTexts = floatTextsRef.current;
    
    let playerDamageTaken = 0;

    // --- 2. Distance & Level Logic ---
    if (!gs.isBossFight) {
      gs.distance += player.speed;
      
      if (gs.distance >= gs.maxDistance && gs.level % 2 === 0) {
        gs.distance = gs.maxDistance;
        gs.isBossFight = true;
        audioService.playWarHorn();
      } else if (gs.distance >= gs.maxDistance) {
        audioService.playShopOpen();
        const nextLevel = gs.level + 1;
        setGameState(prev => ({ ...prev, isShopOpen: true, distance: 0, level: nextLevel }));
        // Update ref immediately to prevent multiple triggers before next render
        gs.isShopOpen = true;
        gs.distance = 0;
        gs.level = nextLevel;
        enemiesRef.current = [];
        projectilesRef.current = [];
        sceneryRef.current = [];
      }
    }

    // --- 3. Player Movement & Actions ---
    let dy = 0;
    const isSwipingUp = touchState.current.active && (touchState.current.currentY - touchState.current.startY) < -20;
    const isSwipingDown = touchState.current.active && (touchState.current.currentY - touchState.current.startY) > 20;
    const isSwipingLeft = touchState.current.active && (touchState.current.currentX - touchState.current.startX) < -20;
    const isSwipingRight = touchState.current.active && (touchState.current.currentX - touchState.current.startX) > 20;

    if (keys.current['ArrowUp'] || isSwipingUp) dy -= 3;
    if (keys.current['ArrowDown'] || isSwipingDown) dy += 3;
    
    if (keys.current['ArrowLeft'] || isSwipingLeft) player.facing = -1;
    if (keys.current['ArrowRight'] || isSwipingRight) player.facing = 1;
    
    const minY = gs.isBossFight ? PLAYER_START_Y - 120 : PLAYER_START_Y - 40;
    const maxY = gs.isBossFight ? PLAYER_START_Y + 100 : PLAYER_START_Y + 60;
    player.y = Math.min(Math.max(player.y + dy, minY), maxY);
    
    const regenRate = player.isHorseback ? 0.008 : 0;
    player.health = Math.min(player.maxHealth, player.health + (regenRate * dt));
    
    const targetX = gs.isBossFight ? 150 : PLAYER_START_X;
    if (Math.abs(player.x - targetX) > 2) {
      player.x += (player.x < targetX ? 1 : -1) * 2;
    } else {
      player.x = targetX;
    }

    // Animation frame
    player.animFrame += dt * 0.01;

    if (keys.current['KeyW'] || pendingActions.current.shoot) {
      if (player.ammo > 0) {
        audioService.playArrow();
        const angle = player.facing === 1 ? 0 : Math.PI;
        projectiles.push({
          id: Math.random().toString(36).substr(2, 9),
          x: player.facing === 1 ? player.x + player.width : player.x,
          y: player.y + player.height / 2,
          width: PROJECTILE_SIZE,
          height: PROJECTILE_SIZE / 2,
          health: 1,
          maxHealth: 1,
          type: 'projectile',
          owner: 'player',
          speed: 10,
          damage: 10 + player.bowLevel * 5,
          angle,
        });
        player.ammo -= 1;
      }
      keys.current['KeyW'] = false;
      pendingActions.current.shoot = false;
    }

    if ((keys.current['KeyQ'] || pendingActions.current.sword) && swordSwingRef.current <= 0) {
      audioService.playSword();
      swordSwingRef.current = 15;
      pendingActions.current.sword = false;
      
      enemies.forEach(enemy => {
        const isRight = player.facing === 1;
        const dx = isRight ? enemy.x - (player.x + player.width) : player.x - (enemy.x + enemy.width);
        const dy = Math.abs(enemy.y - (player.y + player.height / 2));
        if (enemy.enemyType === 'archer') return;
        if (dx < 80 && dx > -30 && dy < 70) {
          const dmg = 18 + player.weaponLevel * 6;
          enemy.health -= dmg;
          spawnFloatText(enemy.x, enemy.y, `-${dmg}`, '#ff4444');
        }
      });
    }
    if (swordSwingRef.current > 0) swordSwingRef.current -= 1;

    if (player.ammo < player.maxAmmo) {
      player.reloadTimer += dt;
      const reloadSpeed = Math.max(500, 4000 - (player.bowLevel - 1) * 500);
      if (player.reloadTimer >= reloadSpeed) {
        player.ammo += 1;
        player.reloadTimer = 0;
      }
    }

    // --- 4. Scenery Update ---
    sceneryRef.current = scenery.map(obj => {
      let speed = obj.speed;
      if (gs.isBossFight && obj.type === 'castle') speed = 0.1;
      return { ...obj, x: obj.x - (speed * (player.speed / 2)) };
    }).filter(obj => obj.x > -400);

    // --- 5. Enemy AI & Movement ---
    enemies.forEach(enemy => {
      enemy.attackTimer += dt;
      enemy.animFrame += dt * 0.01;

      if (enemy.enemyType === 'robber') {
        const tx = enemy.x < player.x ? player.x - enemy.width : player.x + player.width;
        const dir = enemy.x < player.x ? 1 : -1;
        if (Math.abs(enemy.x - tx) > 10) {
          enemy.x += dir * enemy.speed;
          enemy.attackTimer = 0;
        } else {
          enemy.x = tx;
          if (enemy.attackTimer > 1500) {
            playerDamageTaken += enemy.damage;
            spawnFloatText(player.x, player.y, `-${enemy.damage}`, '#ff0000');
            audioService.playHit();
            enemy.attackTimer = 0;
          }
        }
      } else if (enemy.enemyType === 'archer') {
        const dist = Math.abs(enemy.x - player.x);
        if (enemy.isWithdrawing) {
          enemy.x += (enemy.x < player.x ? -1 : 1) * (enemy.speed * 1.2);
          if (enemy.x < 20) enemy.x = 20;
          if (enemy.x > GAME_WIDTH - 20) enemy.x = GAME_WIDTH - 20;
          if (enemy.attackTimer > 5000) { enemy.isWithdrawing = false; enemy.hasShot = false; enemy.attackTimer = 0; }
        } else {
          if (dist > 250) {
            enemy.x += (enemy.x < player.x ? 1 : -1) * enemy.speed;
          } else if (enemy.attackTimer > 1500 && !enemy.hasShot) {
            const angle = Math.atan2((player.y + player.height/2) - (enemy.y + enemy.height/2), player.x - enemy.x);
            projectiles.push({
              id: Math.random().toString(36).substr(2, 9),
              x: enemy.x, y: enemy.y + enemy.height / 2, width: PROJECTILE_SIZE, height: PROJECTILE_SIZE / 2,
              health: 1, maxHealth: 1, type: 'projectile', owner: 'enemy', speed: 5, damage: enemy.damage, angle
            });
            enemy.attackTimer = 0; enemy.hasShot = true; enemy.isWithdrawing = true;
          }
        }
      } else if (enemy.enemyType === 'boss') {
        enemy.chargeTimer = (enemy.chargeTimer || 0) + dt;
        
        if (enemy.isTelegraphing) {
          enemy.telegraphTimer = (enemy.telegraphTimer || 0) + dt;
          if (enemy.telegraphTimer > 2000) {
            enemy.isTelegraphing = false;
            enemy.isCharging = true;
            enemy.chargeTimer = 0;
            enemy.telegraphTimer = 0;
          }
        } else if (enemy.isCharging) {
          const tx = enemy.x < player.x ? player.x - enemy.width : player.x + player.width;
          const dir = enemy.x < player.x ? 1 : -1;
          if (Math.abs(enemy.x - tx) > 10) {
            enemy.x += dir * (enemy.speed * 4);
          } else {
            enemy.x = tx;
            if (enemy.attackTimer > 500) {
              const dmg = Math.floor(enemy.damage * 1.5);
              playerDamageTaken += dmg;
              spawnFloatText(player.x, player.y, `-${dmg}`, '#ff0000');
              audioService.playHit();
              enemy.attackTimer = 0;
            }
          }
          if (enemy.chargeTimer > 3000) {
            enemy.isCharging = false;
            enemy.chargeTimer = 0;
          }
        } else {
          const targetX = GAME_WIDTH - 200;
          if (enemy.x > targetX) enemy.x -= enemy.speed;
          else if (enemy.x < targetX - 50) enemy.x += enemy.speed;
          else {
            enemy.x = targetX;
            if (enemy.attackTimer > 2000) {
              for (let i = -1; i <= 1; i++) {
                const angle = Math.atan2((player.y + player.height / 2) - (enemy.y + enemy.height / 2) + (i * 60), player.x - enemy.x);
                projectiles.push({
                  id: Math.random().toString(36).substr(2, 9),
                  x: enemy.x, y: enemy.y + enemy.height / 2, width: PROJECTILE_SIZE, height: PROJECTILE_SIZE / 2,
                  health: 1, maxHealth: 1, type: 'projectile', owner: 'enemy', speed: 5, damage: 3, angle
                });
              }
              enemy.attackTimer = 0;
            }
          }
          if (enemy.chargeTimer > 8000) {
            enemy.isTelegraphing = true;
            enemy.telegraphTimer = 0;
            audioService.playWarHorn();
          }
        }
      }
    });
    enemiesRef.current = enemies.filter(e => e.x > -200 && e.x < GAME_WIDTH + 200);

    // --- 6. Projectile Movement & Collision ---
    projectilesRef.current = projectiles.map(p => ({
      ...p,
      x: p.x + Math.cos(p.angle) * p.speed,
      y: p.y + Math.sin(p.angle) * p.speed,
    })).filter(p => {
      if (p.x < -100 || p.x > GAME_WIDTH + 100 || p.y < -100 || p.y > GAME_HEIGHT + 100) return false;
      
      if (p.owner === 'player') {
        const hitEnemy = enemiesRef.current.find(e => p.x < e.x + e.width && p.x + p.width > e.x && p.y < e.y + e.height && p.y + p.height > e.y);
        if (hitEnemy) {
          hitEnemy.health -= p.damage;
          spawnFloatText(hitEnemy.x, hitEnemy.y, `-${p.damage}`, '#ff4444');
          audioService.playHit();
          return false;
        }
      } else {
        if (p.x < player.x + player.width && p.x + p.width > player.x && p.y < player.y + player.height && p.y + p.height > player.y) {
          playerDamageTaken += p.damage;
          spawnFloatText(player.x, player.y, `-${p.damage}`, '#ff0000');
          audioService.playHit();
          return false;
        }
      }
      return true;
    });

    // --- 7. Final State Processing ---
    if (playerDamageTaken > 0) {
      player.health = Math.max(0, player.health - playerDamageTaken);
    }

    const deadEnemies = enemiesRef.current.filter(e => e.health <= 0);
    const bossDefeated = deadEnemies.some(e => e.enemyType === 'boss');

    if (deadEnemies.length > 0) {
      audioService.playCoin();
      deadEnemies.forEach(e => {
        player.gold += e.goldValue;
        gs.score += 100;
        spawnFloatText(e.x, e.y, `+${e.goldValue}g`, '#ffd700');
      });
      enemiesRef.current = enemiesRef.current.filter(e => e.health > 0);
    }

    if (bossDefeated) {
      gs.isBossFight = false;
      if (gs.level === 4) {
        setGameState(prev => ({ ...prev, isVictory: true }));
        gs.isVictory = true;
      } else {
        setGameState(prev => ({ ...prev, isKnighting: true }));
        gs.isKnighting = true;
        setKnightingTimer(0);
      }
      projectilesRef.current = [];
      enemiesRef.current = [];
    }

    particlesRef.current = particles.map(p => ({
      ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 0.02
    })).filter(p => p.life > 0);

    floatTextsRef.current = floatTexts.map(t => ({
      ...t, y: t.y - 1, opacity: t.life, life: t.life - 0.02
    })).filter(t => t.life > 0);

    if (player.health <= 0) {
      if (!player.isHorseback) {
        audioService.playCarriageBreak();
        player.isHorseback = true;
        player.health = player.maxHealth;
        player.width = HORSE_WIDTH;
        player.height = HORSE_HEIGHT;
        player.speed += 1;
        spawnFloatText(player.x, player.y, "On horseback!", '#ffffff');
        sceneryRef.current.push({
          id: 'wrecked-' + Math.random().toString(36).substr(2, 9),
          x: player.x, y: player.y, type: 'wrecked_carriage', speed: 2, scale: 1
        });
        for (let i = 0; i < 25; i++) {
          particlesRef.current.push({
            x: player.x + player.width / 2, y: player.y + player.height / 2,
            vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12, life: 1, 
            color: Math.random() > 0.5 ? '#8b4513' : (Math.random() > 0.5 ? '#ff4400' : '#ffd700')
          });
        }
      } else {
        setGameState(prev => ({ ...prev, isGameOver: true }));
        gs.isGameOver = true;
      }
    }

    // --- 9. Timers & Spawning ---
    sceneryTimerRef.current += dt;
    const sceneryRate = (gs.distance / gs.maxDistance) > 0.7 ? 800 : 1500;
    if (sceneryTimerRef.current > sceneryRate) {
      sceneryRef.current.push(createScenery(gs.distance, gs.maxDistance, gs.level, sceneryRef.current));
      sceneryTimerRef.current = 0;
    }

    spawnTimerRef.current += dt;
    if (gs.isBossFight) {
      if (!enemiesRef.current.some(e => e.enemyType === 'boss')) {
        enemiesRef.current.push(createBoss(gs.level));
      }
      if (spawnTimerRef.current > 4000) {
        for (let i = 0; i < 2; i++) enemiesRef.current.push(createEnemy(gs.level));
        spawnTimerRef.current = 0;
      }
    } else if (spawnTimerRef.current > 3000 - (gs.level * 200)) {
      enemiesRef.current.push(createEnemy(gs.level));
      spawnTimerRef.current = 0;
    }
  }, [gameState]);

  // Handle enemy deaths for gold - REMOVED (moved to update)

  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    const gs = gameStateRef.current;
    const player = playerRef.current;
    const enemies = enemiesRef.current;
    const projectiles = projectilesRef.current;
    const scenery = sceneryRef.current;
    const particles = particlesRef.current;
    const floatTexts = floatTextsRef.current;

    const drawHumanoid = (x: number, y: number, type: 'robber' | 'archer', animFrame: number, facing: number) => {
      ctx.save();
      ctx.translate(x, y);
      if (facing === -1) {
        ctx.translate(ENEMY_WIDTH, 0);
        ctx.scale(-1, 1);
      }

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(ENEMY_WIDTH/2, ENEMY_HEIGHT, 15, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      const legAnim = Math.sin(animFrame * 1.5) * 10;
      const armAnim = Math.cos(animFrame * 1.5) * 10;

      // Legs
      ctx.strokeStyle = '#263238';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(ENEMY_WIDTH/2 - 5, ENEMY_HEIGHT - 20);
      ctx.lineTo(ENEMY_WIDTH/2 - 5 + legAnim, ENEMY_HEIGHT);
      ctx.moveTo(ENEMY_WIDTH/2 + 5, ENEMY_HEIGHT - 20);
      ctx.lineTo(ENEMY_WIDTH/2 + 5 - legAnim, ENEMY_HEIGHT);
      ctx.stroke();

      // Body
      ctx.fillStyle = type === 'robber' ? '#37474f' : '#455a64';
      ctx.beginPath();
      ctx.roundRect(5, 10, ENEMY_WIDTH - 10, 30, 5);
      ctx.fill();
      
      // Belt
      ctx.fillStyle = '#212121';
      ctx.fillRect(5, 25, ENEMY_WIDTH - 10, 4);

      // Head
      ctx.fillStyle = '#ffe0b2';
      ctx.fillRect(ENEMY_WIDTH/2 - 10, -5, 20, 20);
      
      // Eyes
      ctx.fillStyle = '#000';
      ctx.fillRect(ENEMY_WIDTH/2 + 2, 2, 3, 3);
      // Eye shine
      ctx.fillStyle = '#fff';
      ctx.fillRect(ENEMY_WIDTH/2 + 4, 2, 1, 1);

      // Hat/Helmet
      ctx.fillStyle = type === 'robber' ? '#212121' : '#546e7a';
      if (type === 'robber') {
        ctx.beginPath();
        ctx.moveTo(ENEMY_WIDTH/2 - 12, -5);
        ctx.lineTo(ENEMY_WIDTH/2 + 12, -5);
        ctx.lineTo(ENEMY_WIDTH/2, -15);
        ctx.fill();
      } else {
        ctx.fillRect(ENEMY_WIDTH/2 - 11, -8, 22, 6);
      }

      // Arms & Weapon
      ctx.strokeStyle = '#ffe0b2';
      ctx.lineWidth = 4;
      if (type === 'archer') {
        // Holding bow
        ctx.beginPath();
        ctx.moveTo(ENEMY_WIDTH/2, 20);
        ctx.lineTo(ENEMY_WIDTH/2 + 15, 20 + armAnim/2);
        ctx.stroke();
        
        // Bow
        ctx.strokeStyle = '#8d6e63';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(ENEMY_WIDTH/2 + 15, 20, 20, -Math.PI/2, Math.PI/2);
        ctx.stroke();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ENEMY_WIDTH/2 + 15, 0);
        ctx.lineTo(ENEMY_WIDTH/2 + 15, 40);
        ctx.stroke();
      } else {
        // Holding sword
        ctx.beginPath();
        ctx.moveTo(ENEMY_WIDTH/2, 20);
        ctx.lineTo(ENEMY_WIDTH/2 + 15 + armAnim, 20 + armAnim);
        ctx.stroke();
        
        // Sword
        ctx.save();
        ctx.translate(ENEMY_WIDTH/2 + 15 + armAnim, 20 + armAnim);
        ctx.rotate(Math.PI/4 + armAnim * 0.05);
        ctx.strokeStyle = '#b0bec5';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -25); ctx.stroke();
        ctx.strokeStyle = '#5d4037';
        ctx.lineWidth = 6;
        ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.stroke();
        ctx.restore();
      }

      ctx.restore();
    };

    const drawBoss = (boss: Enemy) => {
      ctx.save();
      ctx.translate(boss.x, boss.y);
      
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(boss.width/2, boss.height, 40, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Telegraph Flash
      if (boss.isTelegraphing && Math.floor(Date.now() / 100) % 2 === 0) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff0000';
      }

      const anim = Math.sin(boss.animFrame * 1.5) * 15;
      const chargeOffset = boss.isCharging ? Math.sin(Date.now() * 0.05) * 5 : 0;

      // Cape
      ctx.fillStyle = '#b71c1c';
      ctx.beginPath();
      ctx.moveTo(20, 20);
      ctx.lineTo(-20 - anim/2, 80 + anim);
      ctx.lineTo(40, 90);
      ctx.lineTo(80 + anim/2, 80 - anim);
      ctx.lineTo(boss.width - 20, 20);
      ctx.fill();

      // Legs
      ctx.strokeStyle = '#37474f';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(boss.width/2 - 15, 70);
      ctx.lineTo(boss.width/2 - 15 + anim, 100);
      ctx.moveTo(boss.width/2 + 15, 70);
      ctx.lineTo(boss.width/2 + 15 - anim, 100);
      ctx.stroke();

      // Body Armor
      ctx.fillStyle = '#455a64';
      ctx.beginPath();
      ctx.roundRect(10, 10, boss.width - 20, 70, 10);
      ctx.fill();
      // Chestplate detail
      ctx.strokeStyle = '#90a4ae';
      ctx.lineWidth = 2;
      ctx.strokeRect(25, 25, boss.width - 50, 40);

      // Head / Helmet
      ctx.fillStyle = '#37474f';
      ctx.fillRect(boss.width/2 - 20, -15, 40, 40);
      // Visor
      ctx.fillStyle = '#212121';
      ctx.fillRect(boss.width/2 - 18, -5, 36, 10);
      // Glowing Eyes
      ctx.fillStyle = '#ff1744';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#ff1744';
      ctx.fillRect(boss.width/2 - 12, -2, 6, 4);
      ctx.fillRect(boss.width/2 + 6, -2, 6, 4);
      ctx.shadowBlur = 0;

      // Plume
      ctx.fillStyle = '#d32f2f';
      ctx.beginPath();
      ctx.moveTo(boss.width/2, -15);
      ctx.quadraticCurveTo(boss.width/2 - 30, -40, boss.width/2 - 40, -10);
      ctx.fill();

      // Shield (Left Arm)
      ctx.save();
      ctx.translate(10 + chargeOffset, 40 + anim/2);
      ctx.fillStyle = '#546e7a';
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(30, 0); ctx.lineTo(15, 40); ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#90a4ae';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();

      // Sword (Right Arm)
      ctx.save();
      ctx.translate(boss.width - 10 - chargeOffset, 40 - anim/2);
      ctx.rotate(boss.isCharging ? -Math.PI/4 : Math.PI/6 + anim * 0.02);
      // Blade
      ctx.strokeStyle = '#cfd8dc';
      ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -60); ctx.stroke();
      // Hilt
      ctx.strokeStyle = '#fbc02d';
      ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(-15, 0); ctx.lineTo(15, 0); ctx.stroke();
      ctx.restore();

      ctx.restore();
    };

    // Draw Background
    ctx.fillStyle = '#7cb342'; // Vibrant grass
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw Scenery (Mountains - Far Background)
    scenery.filter(s => s.type === 'mountain').forEach(s => {
      ctx.fillStyle = '#90a4ae';
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + 100 * s.scale, s.y);
      ctx.lineTo(s.x + 50 * s.scale, s.y - 80 * s.scale);
      ctx.fill();
      // Snow cap
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(s.x + 35 * s.scale, s.y - 55 * s.scale);
      ctx.lineTo(s.x + 65 * s.scale, s.y - 55 * s.scale);
      ctx.lineTo(s.x + 50 * s.scale, s.y - 80 * s.scale);
      ctx.fill();
    });

    // Draw Grass Details
    ctx.fillStyle = '#689f38';
    for (let i = 0; i < 50; i++) {
      const gx = (Math.sin(i * 123.45) * 0.5 + 0.5) * GAME_WIDTH;
      const gy = (Math.cos(i * 678.90) * 0.5 + 0.5) * GAME_HEIGHT;
      if (gy < PLAYER_START_Y - 20 || gy > PLAYER_START_Y + 80) {
        ctx.fillRect(gx, gy, 2, 6);
      }
    }

    // Draw Road
    const roadGradient = ctx.createLinearGradient(0, PLAYER_START_Y - 20, 0, PLAYER_START_Y + 80);
    roadGradient.addColorStop(0, '#8d6e63');
    roadGradient.addColorStop(0.5, '#a1887f');
    roadGradient.addColorStop(1, '#8d6e63');
    ctx.fillStyle = roadGradient;
    ctx.fillRect(0, PLAYER_START_Y - 20, GAME_WIDTH, 100);
    
    // Road Ruts (Scrolling)
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 4;
    scenery.filter(s => s.type === 'road_rut').forEach(s => {
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x + 40 * s.scale, s.y);
      ctx.stroke();
    });

    // Road Stones
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for (let i = 0; i < 20; i++) {
      const sx = (Math.sin(i * 456.78) * 0.5 + 0.5) * GAME_WIDTH;
      const sy = PLAYER_START_Y + (Math.cos(i * 123.45) * 0.5 + 0.5) * 80;
      ctx.beginPath();
      ctx.ellipse(sx, sy, 5, 3, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw Scenery (Trees, Houses, Streams)
    scenery.filter(s => s.type !== 'mountain' && s.type !== 'road_rut').forEach(s => {
      if (s.type === 'tree') {
        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.beginPath();
        ctx.ellipse(s.x + 15 * s.scale, s.y + 20 * s.scale, 20 * s.scale, 8 * s.scale, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#5d4037';
        ctx.fillRect(s.x + 10 * s.scale, s.y, 10 * s.scale, 20 * s.scale);
        
        // Layered Canopy
        ctx.fillStyle = '#1b5e20';
        ctx.beginPath();
        ctx.arc(s.x + 15 * s.scale, s.y - 5 * s.scale, 22 * s.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#2e7d32';
        ctx.beginPath();
        ctx.arc(s.x + 15 * s.scale, s.y - 15 * s.scale, 18 * s.scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#4caf50';
        ctx.beginPath();
        ctx.arc(s.x + 15 * s.scale, s.y - 25 * s.scale, 12 * s.scale, 0, Math.PI * 2);
        ctx.fill();
      } else if (s.type === 'house') {
        ctx.fillStyle = '#a1887f';
        ctx.fillRect(s.x, s.y, 40 * s.scale, 30 * s.scale);
        ctx.fillStyle = '#3e2723';
        ctx.beginPath();
        ctx.moveTo(s.x - 5 * s.scale, s.y);
        ctx.lineTo(s.x + 45 * s.scale, s.y);
        ctx.lineTo(s.x + 20 * s.scale, s.y - 20 * s.scale);
        ctx.fill();
        
        // Chimney & Smoke
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(s.x + 30 * s.scale, s.y - 15 * s.scale, 8 * s.scale, 10 * s.scale);
        
        const smokeOffset = (gs.distance * 0.1) % 40;
        ctx.fillStyle = 'rgba(200,200,200,0.4)';
        for (let i = 0; i < 3; i++) {
          const sy = s.y - 20 * s.scale - (smokeOffset + i * 20) % 60;
          const sx = s.x + 34 * s.scale + Math.sin(sy * 0.1) * 5;
          const size = 5 + (i * 2);
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Window with light
        ctx.fillStyle = '#fff176';
        ctx.fillRect(s.x + 10 * s.scale, s.y + 10 * s.scale, 8 * s.scale, 8 * s.scale);
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 1;
        ctx.strokeRect(s.x + 10 * s.scale, s.y + 10 * s.scale, 8 * s.scale, 8 * s.scale);
      } else if (s.type === 'stream') {
        ctx.fillStyle = '#4fc3f7';
        ctx.beginPath();
        ctx.roundRect(s.x, s.y, 100 * s.scale, 15 * s.scale, 5);
        ctx.fill();
        // Water ripples
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.lineWidth = 2;
        const rippleOffset = (gs.distance * 0.05) % 20;
        ctx.beginPath();
        ctx.moveTo(s.x + 10 + rippleOffset, s.y + 5);
        ctx.lineTo(s.x + 30 + rippleOffset, s.y + 5);
        ctx.moveTo(s.x + 50 - rippleOffset, s.y + 10);
        ctx.lineTo(s.x + 80 - rippleOffset, s.y + 10);
        ctx.stroke();
      } else if (s.type === 'side_road') {
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.beginPath();
        ctx.roundRect(s.x, s.y, 120 * s.scale, 8 * s.scale, 4);
        ctx.fill();
      } else if (s.type === 'castle') {
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.scale(s.scale, s.scale);
        
        // Main Keep
        ctx.fillStyle = '#78909c';
        ctx.fillRect(0, 0, 60, 60);
        
        // Towers
        ctx.fillStyle = '#546e7a';
        ctx.fillRect(-15, -10, 20, 70);
        ctx.fillRect(55, -10, 20, 70);
        
        // Roofs (Cones)
        ctx.fillStyle = '#b71c1c';
        ctx.beginPath();
        ctx.moveTo(-20, -10); ctx.lineTo(10, -10); ctx.lineTo(-5, -30); ctx.fill();
        ctx.beginPath();
        ctx.moveTo(50, -10); ctx.lineTo(80, -10); ctx.lineTo(65, -30); ctx.fill();
        
        // Gate
        ctx.fillStyle = '#3e2723';
        ctx.beginPath();
        ctx.roundRect(20, 30, 20, 30, 5);
        ctx.fill();
        
        // Windows
        ctx.fillStyle = '#1a237e';
        ctx.fillRect(5, 10, 8, 12);
        ctx.fillRect(47, 10, 8, 12);
        
        ctx.restore();
      } else if (s.type === 'wrecked_carriage') {
        ctx.save();
        ctx.translate(s.x, s.y);
        // Broken body
        ctx.fillStyle = '#4e342e';
        ctx.beginPath();
        ctx.roundRect(0, 10, CARRIAGE_WIDTH, CARRIAGE_HEIGHT - 20, 10);
        ctx.fill();
        // Broken roof
        ctx.fillStyle = '#3e2723';
        ctx.beginPath();
        ctx.moveTo(-5, 15);
        ctx.lineTo(CARRIAGE_WIDTH + 5, 15);
        ctx.lineTo(CARRIAGE_WIDTH - 10, 0);
        ctx.lineTo(10, 0);
        ctx.fill();
        // Detached wheels
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(-10, CARRIAGE_HEIGHT - 10, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(CARRIAGE_WIDTH + 10, CARRIAGE_HEIGHT - 5, 15, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    });

    // Draw Player
    ctx.save();
    ctx.translate(player.x, player.y);

    if (player.isHorseback) {
      // Draw Horse (Always facing right)
      // Body
      ctx.fillStyle = '#5d4037';
      ctx.beginPath();
      ctx.roundRect(0, 10, 60, 35, 15);
      ctx.fill();
      
      // Neck & Head
      ctx.beginPath();
      ctx.moveTo(50, 15);
      ctx.lineTo(75, -5);
      ctx.lineTo(85, 5);
      ctx.lineTo(60, 30);
      ctx.fill();
      
      // Eye
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(78, 2, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Ear
      ctx.fillStyle = '#5d4037';
      ctx.beginPath();
      ctx.moveTo(70, -2);
      ctx.lineTo(75, -12);
      ctx.lineTo(80, -5);
      ctx.fill();
      
      // Legs (Animated)
      const legOffset = Math.sin(player.animFrame * 1.5) * 10;
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#3e2723';
      ctx.beginPath();
      ctx.moveTo(10, 40); ctx.lineTo(10 + legOffset, 60);
      ctx.moveTo(20, 40); ctx.lineTo(20 - legOffset, 60);
      ctx.moveTo(40, 40); ctx.lineTo(40 + legOffset, 60);
      ctx.moveTo(50, 40); ctx.lineTo(50 - legOffset, 60);
      ctx.stroke();
      
      // Rider & Princess (Flip based on facing)
      ctx.save();
      if (player.facing === -1) {
        ctx.translate(player.width / 2, 0);
        ctx.scale(-1, 1);
        ctx.translate(-player.width / 2, 0);
      }

      // Rider (Courier)
      ctx.fillStyle = '#2e7d32'; // Green tunic
      ctx.beginPath();
      ctx.roundRect(15, -15, 20, 30, 5);
      ctx.fill();
      ctx.fillStyle = '#ffe0b2'; // Skin
      ctx.fillRect(20, -25, 10, 10);
      ctx.fillStyle = '#3e2723'; // Hat
      ctx.fillRect(18, -28, 14, 4);
      
      // Princess
      ctx.fillStyle = '#f06292'; // Pink dress
      ctx.beginPath();
      ctx.roundRect(40, -10, 15, 25, 5);
      ctx.fill();
      ctx.fillStyle = '#ffe0b2';
      ctx.fillRect(43, -18, 10, 10);
      ctx.fillStyle = '#fdd835'; // Golden hair
      ctx.fillRect(42, -20, 12, 5);
      // Crown
      ctx.fillStyle = '#fbc02d';
      ctx.beginPath();
      ctx.moveTo(42, -22);
      ctx.lineTo(45, -27);
      ctx.lineTo(48, -22);
      ctx.lineTo(51, -27);
      ctx.lineTo(54, -22);
      ctx.fill();
      ctx.restore();
    } else {
      // Draw Carriage
      if (player.facing === -1) {
        ctx.save();
        ctx.translate(player.width, 0);
        ctx.scale(-1, 1);
      }
      
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.ellipse(player.width/2, player.height + 10, player.width/2 + 10, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Horse pulling carriage
      ctx.save();
      ctx.translate(player.width + 10, 10);
      // Horse Body
      ctx.fillStyle = '#5d4037';
      ctx.beginPath();
      ctx.roundRect(0, 0, 50, 30, 10);
      ctx.fill();
      // Horse Head
      ctx.beginPath();
      ctx.moveTo(40, 5);
      ctx.lineTo(60, -10);
      ctx.lineTo(70, 0);
      ctx.lineTo(50, 20);
      ctx.fill();

      // Eye
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(63, -2, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Ear
      ctx.fillStyle = '#5d4037';
      ctx.beginPath();
      ctx.moveTo(55, -8);
      ctx.lineTo(58, -15);
      ctx.lineTo(62, -10);
      ctx.fill();
      // Legs
      const legOffset = Math.sin(player.animFrame * 10) * 8;
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#3e2723';
      ctx.beginPath();
      ctx.moveTo(10, 30); ctx.lineTo(10 + legOffset, 45);
      ctx.moveTo(20, 30); ctx.lineTo(20 - legOffset, 45);
      ctx.moveTo(35, 30); ctx.lineTo(35 + legOffset, 45);
      ctx.moveTo(45, 30); ctx.lineTo(45 - legOffset, 45);
      ctx.stroke();
      // Reins
      ctx.strokeStyle = '#212121';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-10, 10);
      ctx.lineTo(10, 10);
      ctx.stroke();
      ctx.restore();

      // Main Body
      const carriageGrad = ctx.createLinearGradient(0, 0, 0, player.height);
      carriageGrad.addColorStop(0, '#795548');
      carriageGrad.addColorStop(1, '#4e342e');
      ctx.fillStyle = carriageGrad;
      ctx.beginPath();
      ctx.roundRect(0, 0, player.width, player.height - 10, 10);
      ctx.fill();
      
      // Gold Trim
      ctx.strokeStyle = '#fdd835';
      ctx.lineWidth = 3;
      ctx.strokeRect(10, 10, player.width - 20, player.height - 30);
      
      // Roof
      ctx.fillStyle = '#3e2723';
      ctx.beginPath();
      ctx.moveTo(-10, 5);
      ctx.lineTo(player.width + 10, 5);
      ctx.lineTo(player.width, -15);
      ctx.lineTo(0, -15);
      ctx.fill();
      
      // Lantern
      ctx.fillStyle = '#212121';
      ctx.fillRect(player.width - 5, 10, 8, 12);
      ctx.fillStyle = '#fff176';
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#fff176';
      ctx.fillRect(player.width - 3, 12, 4, 8);
      ctx.shadowBlur = 0;

      // Windows
      ctx.fillStyle = '#bbdefb';
      ctx.fillRect(25, 20, 25, 25);
      ctx.fillRect(player.width - 50, 20, 25, 25);
      
      // Courier in carriage
      ctx.fillStyle = '#ffe0b2';
      ctx.fillRect(player.width - 45, 22, 15, 15);
      ctx.fillStyle = '#2e7d32';
      ctx.fillRect(player.width - 48, 18, 20, 5);

      // Princess in carriage
      ctx.fillStyle = '#ffe0b2';
      ctx.fillRect(30, 22, 15, 15);
      ctx.fillStyle = '#fbc02d'; // Crown
      ctx.fillRect(32, 18, 10, 4);
      
      // Wheels
      const wheelRotation = player.animFrame * 5;
      const drawWheel = (x: number, y: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(wheelRotation);
        ctx.strokeStyle = '#3e2723';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.stroke();
        // Spokes
        for(let i=0; i<8; i++) {
          ctx.rotate(Math.PI/4);
          ctx.beginPath();
          ctx.moveTo(0,0); ctx.lineTo(18, 0);
          ctx.stroke();
        }
        ctx.restore();
      };
      drawWheel(30, player.height + 5);
      drawWheel(player.width - 30, player.height + 5);
      if (player.facing === -1) {
        ctx.restore();
      }
    }
    ctx.restore();

    // Draw Enemies
    enemies.forEach(enemy => {
      if (enemy.enemyType === 'boss') {
        drawBoss(enemy);
      } else {
        drawHumanoid(enemy.x, enemy.y, enemy.enemyType as 'robber' | 'archer', enemy.animFrame, enemy.x < player.x ? 1 : -1);
      }

      // Health bar
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      const barY = enemy.enemyType === 'boss' ? -60 : -25;
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, barY, enemy.width, 6);
      ctx.fillStyle = enemy.enemyType === 'boss' ? '#fbc02d' : '#ef5350';
      ctx.fillRect(0, barY, (enemy.health / enemy.maxHealth) * enemy.width, 6);
      ctx.restore();
    });

    // Draw Projectiles
    projectiles.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      
      if (p.owner === 'player') {
        ctx.strokeStyle = '#795548';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-25, 0); ctx.lineTo(10, 0);
        ctx.stroke();
        ctx.fillStyle = '#9e9e9e';
        ctx.beginPath();
        ctx.moveTo(10, 0); ctx.lineTo(0, -4); ctx.lineTo(0, 4);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillRect(-25, -4, 8, 8);
      } else {
        ctx.fillStyle = '#fff';
        ctx.beginPath();
        ctx.arc(0, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ff1744';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 15;
        ctx.shadowColor = '#ff1744';
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
      ctx.restore();
    });

    // Draw Particles
    particles.forEach(p => {
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, 4, 4);
      ctx.globalAlpha = 1;
    });

    // Draw Float Texts
    ctx.font = 'bold 20px Inter';
    ctx.textAlign = 'center';
    floatTexts.forEach(t => {
      ctx.globalAlpha = t.opacity;
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, t.x, t.y);
      ctx.globalAlpha = 1;
    });

    // Sword Swing Visual
    if (swordSwingRef.current > 0) {
      ctx.save();
      const progress = (15 - swordSwingRef.current) / 15;
      const swingAngle = player.facing === 1 
        ? -Math.PI / 2 + progress * Math.PI 
        : Math.PI / 2 + progress * Math.PI;
      
      ctx.translate(player.facing === 1 ? player.x + player.width : player.x, player.y + player.height / 2);
      ctx.rotate(swingAngle);
      
      ctx.fillStyle = '#e0e0e0';
      ctx.strokeStyle = '#9e9e9e';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(60, -5);
      ctx.lineTo(70, 0);
      ctx.lineTo(60, 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(-10, -2, 15, 4);
      ctx.fillStyle = '#fbc02d';
      ctx.fillRect(-2, -10, 4, 20);
      
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = `rgba(255, 255, 255, ${swordSwingRef.current / 30})`;
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.arc(player.facing === 1 ? player.x + player.width : player.x, player.y + player.height / 2, 60, player.facing === 1 ? -Math.PI / 2 : Math.PI / 2, swingAngle);
      ctx.stroke();
      ctx.restore();
    }

    if (gs.isKnighting) {
      ctx.fillStyle = 'rgba(0,0,0,0.8)';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      const centerX = GAME_WIDTH / 2;
      const centerY = GAME_HEIGHT / 2;

      ctx.save();
      ctx.translate(centerX - 60, centerY + 40);
      ctx.fillStyle = '#4a7c59';
      ctx.beginPath();
      ctx.roundRect(0, 0, 40, 30, 5);
      ctx.fill();
      ctx.fillStyle = '#ffe0b2';
      ctx.fillRect(10, -20, 20, 20);
      ctx.restore();

      ctx.save();
      ctx.translate(centerX + 40, centerY);
      ctx.fillStyle = '#4527a0';
      ctx.beginPath();
      ctx.roundRect(0, 0, 45, 70, 8);
      ctx.fill();
      ctx.fillStyle = '#ffe0b2';
      ctx.fillRect(12, -20, 22, 22);
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.moveTo(12, -20); ctx.lineTo(12, -32); ctx.lineTo(17, -26); ctx.lineTo(23, -32); ctx.lineTo(28, -26); ctx.lineTo(34, -32); ctx.lineTo(34, -20);
      ctx.fill();
      
      // King's Sword
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      
      if (knightingTimer < 1500) {
        ctx.beginPath();
        ctx.moveTo(5, 30);
        ctx.lineTo(-90, 45);
        ctx.stroke();
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(0, 20, 10, 20);
      } else if (knightingTimer < 3000) {
        ctx.beginPath();
        ctx.moveTo(5, 30);
        ctx.lineTo(-70, 45);
        ctx.stroke();
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(0, 20, 10, 20);
      } else {
        ctx.beginPath();
        ctx.moveTo(5, 30);
        ctx.lineTo(-10, -50);
        ctx.stroke();
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(0, 20, 10, 20);
      }
      ctx.restore();

      ctx.fillStyle = '#fff';
      ctx.font = 'bold 28px Inter';
      ctx.textAlign = 'center';
      
      let title = "Courier of the Road";
      if (gs.level === 3) title = "Lord Protector of the Realm";
      else if (gs.level === 2) title = "Knight of the Realm";

      ctx.fillText(`I knight thee, ${title}!`, centerX, centerY + 120);
      ctx.font = '16px Inter';
      ctx.fillText("For bravery in the face of the Great Ambush.", centerX, centerY + 150);
    }
  }, [gameState.isKnighting, knightingTimer]);

  useEffect(() => {
    updateRef.current = update;
  }, [update]);

  useEffect(() => {
    drawRef.current = draw;
  }, [draw]);

  const loop = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    if (updateRef.current) updateRef.current(deltaTime);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx && drawRef.current) drawRef.current(ctx);
    }

    requestRef.current = requestAnimationFrame(loop);
  }, []);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(loop);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [loop]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState.isPaused || gameState.isGameOver || gameState.isShopOpen) return;
    pendingActions.current.sword = true;
  };

  const restartGame = () => {
    audioService.playClick();
    setGameState({
      distance: 0,
      maxDistance: 3500,
      isGameOver: false,
      isPaused: false,
      isShopOpen: false,
      isBossFight: false,
      isKnighting: false,
      isCinematic: false,
      isVictory: false,
      hasStarted: true,
      score: 0,
      level: 1,
    });
    playerRef.current = {
      id: 'player',
      x: PLAYER_START_X,
      y: PLAYER_START_Y,
      width: CARRIAGE_WIDTH,
      height: CARRIAGE_HEIGHT,
      health: 100,
      maxHealth: 100,
      type: 'player',
      speed: 2,
      gold: 0,
      weaponLevel: 1,
      bowLevel: 1,
      armorLevel: 1,
      horseLevel: 1,
      isHorseback: false,
      ammo: 10,
      maxAmmo: 10,
      reloadTimer: 0,
      facing: 1,
      animFrame: 0,
    };
    enemiesRef.current = [];
    projectilesRef.current = [];
    particlesRef.current = [];
    sceneryRef.current = [];
    floatTextsRef.current = [];
    hudSyncTimerRef.current = 10;
  };

  const upgrade = (type: 'weapon' | 'bow' | 'armor' | 'horse') => {
    const p = playerRef.current;
    let currentLevel = 1;
    if (type === 'weapon') currentLevel = p.weaponLevel;
    else if (type === 'bow') currentLevel = p.bowLevel;
    else if (type === 'armor') currentLevel = p.armorLevel;
    else if (type === 'horse') currentLevel = p.horseLevel;

    const cost = 50 * currentLevel;
    
    if (p.gold >= cost) {
      audioService.playUpgrade();
      p.gold -= cost;
      
      if (type === 'weapon') p.weaponLevel += 1;
      else if (type === 'bow') p.bowLevel += 1;
      else if (type === 'armor') {
        p.armorLevel += 1;
        p.maxHealth += 20;
        p.health += 20;
      }
      else if (type === 'horse') {
        p.horseLevel += 1;
        p.speed += 0.5;
      }
      
      // Force immediate HUD sync with the latest values from playerRef.current
      const reloadSpeed = Math.max(500, 4000 - (p.bowLevel - 1) * 500);
      setHudState(prev => ({
        ...prev,
        gold: p.gold,
        weaponLevel: p.weaponLevel,
        bowLevel: p.bowLevel,
        armorLevel: p.armorLevel,
        horseLevel: p.horseLevel,
        maxHealth: p.maxHealth,
        health: p.health,
        speed: p.speed,
        reloadProgress: p.reloadTimer / reloadSpeed
      }));
      hudSyncTimerRef.current = 0;
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-0 lg:p-4 bg-[#f5f5f0] font-serif overflow-hidden">
      {/* Portrait Overlay */}
      {isTouchDevice && (
        <div className="fixed inset-0 z-[100] bg-black text-white flex-col items-center justify-center p-8 text-center hidden portrait:flex">
          <RotateCcw className="w-16 h-16 mb-4 animate-[spin_3s_linear_infinite]" />
          <h2 className="text-2xl font-bold mb-2">Please Rotate Your Device</h2>
          <p className="text-white/70">This game is best played in landscape mode.</p>
        </div>
      )}

      <div className="relative w-full h-[100dvh] lg:h-auto lg:max-w-[1000px] lg:aspect-[2/1] bg-black lg:rounded-xl overflow-hidden shadow-2xl border-0 lg:border-4 border-[#5A5A40]">
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          onClick={handleCanvasClick}
          onTouchStart={(e) => {
            touchState.current.active = true;
            touchState.current.startX = e.touches[0].clientX;
            touchState.current.startY = e.touches[0].clientY;
            touchState.current.currentX = e.touches[0].clientX;
            touchState.current.currentY = e.touches[0].clientY;
          }}
          onTouchMove={(e) => {
            if (!touchState.current.active) return;
            touchState.current.currentX = e.touches[0].clientX;
            touchState.current.currentY = e.touches[0].clientY;
          }}
          onTouchEnd={() => {
            touchState.current.active = false;
          }}
          className="w-full h-full cursor-crosshair touch-none"
        />

        {/* Mobile Controls */}
        {isTouchDevice && gameState.hasStarted && !gameState.isGameOver && !gameState.isVictory && !gameState.isShopOpen && !gameState.isCinematic && !gameState.isKnighting && (
          <>
            <div className="absolute bottom-4 left-4 z-40">
              <button
                className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/50 flex items-center justify-center active:bg-white/40 touch-none"
                onTouchStart={(e) => { e.preventDefault(); pendingActions.current.shoot = true; }}
              >
                <Crosshair className="w-8 h-8 text-white" />
              </button>
            </div>
            <div className="absolute bottom-4 right-4 z-40">
              <button
                className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/50 flex items-center justify-center active:bg-white/40 touch-none"
                onTouchStart={(e) => { e.preventDefault(); pendingActions.current.sword = true; }}
              >
                <Sword className="w-8 h-8 text-white" />
              </button>
            </div>
          </>
        )}

        {/* HUD */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start pointer-events-none">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 bg-black/50 p-2 rounded-lg backdrop-blur-sm border border-white/10">
              <Heart className="text-red-500 w-5 h-5" />
              <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-500 transition-all duration-300" 
                  style={{ width: `${(hudState.health / hudState.maxHealth) * 100}%` }}
                />
              </div>
              <span className="text-white text-xs font-mono">{Math.ceil(hudState.health)}/{hudState.maxHealth}</span>
            </div>
            <div className="flex items-center gap-2 bg-black/50 p-2 rounded-lg backdrop-blur-sm border border-white/10 relative">
              <Crosshair className="text-yellow-500 w-5 h-5" />
              <div className="w-32 h-3 bg-gray-700 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-yellow-500 transition-all duration-300" 
                  style={{ width: `${(hudState.ammo / hudState.maxAmmo) * 100}%` }}
                />
                {hudState.reloadProgress > 0 && (
                  <div 
                    className="absolute top-0 left-0 h-full bg-white/40"
                    style={{ width: `${hudState.reloadProgress * 100}%` }}
                  />
                )}
              </div>
              <span className="text-white text-xs font-mono">{hudState.ammo}/{hudState.maxAmmo}</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-col items-end gap-1 bg-black/50 p-2 rounded-lg backdrop-blur-sm border border-white/10">
              <div className="flex justify-between w-48 text-[10px] text-white/70 uppercase tracking-widest font-bold mb-1">
                <span>Kingdom Road</span>
                <span>Level {gameState.level}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] text-blue-300 mb-0.5">EST. ARRIVAL: {Math.ceil((gameState.maxDistance - gameState.distance) / (hudState.speed * 60))} MIN</span>
                  <div className="flex items-center gap-2">
                    <MapPin className="text-blue-400 w-5 h-5" />
                    <div className="w-48 h-3 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-400 transition-all duration-300" 
                        style={{ width: `${gameState.isShopOpen ? 100 : (gameState.distance / gameState.maxDistance) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-black/50 p-2 rounded-lg backdrop-blur-sm border border-white/10">
              <Coins className="text-yellow-400 w-5 h-5" />
              <span className="text-white font-bold">{hudState.gold}</span>
            </div>
          </div>
        </div>

        {/* Cinematic Sequence */}
        <AnimatePresence>
          {gameState.isCinematic && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#f5f5f0] flex flex-col items-center justify-center p-12 text-center"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="max-w-xl"
              >
                <div className="flex justify-center gap-4 mb-8">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="w-12 h-16 bg-[#4a7c59] rounded-t-lg mb-1" />
                      <div className="w-8 h-8 bg-[#ffe0b2] rounded-full -mt-20" />
                    </div>
                  ))}
                </div>
                <h2 className="text-2xl font-serif italic text-[#5A5A40] mb-6 leading-relaxed">
                  {gameState.level === 4 
                    ? "\"More enemy armies have invaded our peaceful kingdom. Please help us!\""
                    : "\"Be safe on your return journey, brave courier! The evil warlord is pillaging the countryside with his minions.\""
                  }
                </h2>
                <Button 
                  size="lg"
                  onClick={() => setGameState(prev => ({ ...prev, isCinematic: false, isPaused: false }))}
                  className="bg-[#5A5A40] hover:bg-[#4A4A30] text-white px-8 rounded-full"
                >
                  To the Road!
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start Menu */}
        <AnimatePresence>
          {!gameState.hasStarted && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center backdrop-blur-md z-50"
            >
              <h1 className="text-6xl text-white font-bold mb-2 tracking-tighter italic text-center">Royal Courier: Kingdom Road</h1>
              <p className="text-white/50 text-sm mb-8 uppercase tracking-[0.3em] font-bold">created by Christopher Wu</p>
              <p className="text-white/70 mb-8 text-center max-w-md">
                The countryside is full of bandits. Our King commands you to protect the princess and bring her to our neighboring castle safely.
              </p>
              <p className="text-white/40 text-xs mb-8">
                Use <Badge variant="outline" className="text-white border-white">Q</Badge> for sword and <Badge variant="outline" className="text-white border-white">W</Badge> to shoot arrows. <Badge variant="outline" className="text-white border-white">Space</Badge> to Pause.
              </p>
              <Button 
                size="lg" 
                onClick={() => setGameState(prev => ({ ...prev, isPaused: false, hasStarted: true }))}
                className="bg-[#5A5A40] hover:bg-[#4A4A30] text-white px-12 py-8 text-2xl rounded-full"
              >
                <Play className="mr-2 fill-current" /> Start Journey
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause Screen */}
        <AnimatePresence>
          {gameState.isPaused && gameState.hasStarted && !gameState.isGameOver && !gameState.isShopOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-[2px] z-40"
            >
              <h2 className="text-6xl text-white font-bold tracking-widest italic drop-shadow-2xl">PAUSED</h2>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Over Screen */}
        <AnimatePresence>
          {gameState.isGameOver && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 bg-red-950/90 flex flex-row items-center justify-center gap-16 backdrop-blur-xl p-12 overflow-y-auto z-50"
            >
              <div className="scale-[1.5] hidden lg:block">
                <DefeatIllustration />
              </div>

              <div className="flex flex-col items-start max-w-md py-8">
                <h2 className="text-5xl text-white font-bold mb-4 italic">Ambushed!</h2>
                <p className="text-white/70 mb-8">The journey ends here. The princess was captured.</p>
                
                <div className="bg-white/10 p-6 rounded-2xl border border-white/20 mb-8 text-center w-full">
                  <p className="text-white/50 text-sm uppercase tracking-widest mb-1">Final Score</p>
                  <p className="text-4xl text-white font-bold">{gameState.score}</p>
                </div>
                
                <Button 
                  size="lg" 
                  onClick={restartGame}
                  className="bg-white text-red-950 hover:bg-white/90 px-12 py-8 text-2xl rounded-full w-full"
                >
                  <RotateCcw className="mr-2" /> Try Again
                </Button>
                <p className="text-white/30 text-xs mt-6">Created by Christopher Wu</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Victory Screen */}
        <AnimatePresence>
          {gameState.isVictory && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-yellow-500/95 flex flex-col items-center justify-start backdrop-blur-xl p-6 md:p-12 overflow-y-auto z-50"
            >
              <Confetti />
              <div className="w-full max-w-6xl flex flex-col items-center py-20">
                <motion.h2 
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-6xl md:text-8xl text-white font-bold mb-16 italic drop-shadow-2xl text-center"
                >
                  Royal Victory!
                </motion.h2>
                
                <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12 mb-20">
                  <motion.div 
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex-1 text-left"
                  >
                    <p className="text-white text-2xl md:text-4xl font-serif italic leading-relaxed drop-shadow-md">
                      "The king offers the princess's hand to you in marriage. You are now the heir to the throne!"
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex-1 flex flex-col md:flex-row items-center justify-center lg:justify-end gap-12"
                  >
                    <div className="bg-white/20 p-8 md:p-12 rounded-[40px] border-2 border-white/40 text-center backdrop-blur-lg shadow-2xl min-w-[280px] md:min-w-[350px]">
                      <p className="text-white/80 text-sm md:text-base uppercase tracking-[0.3em] mb-4 font-bold">Legendary Score</p>
                      <p className="text-7xl md:text-9xl text-white font-black drop-shadow-lg">{gameState.score}</p>
                    </div>
                    <div className="scale-[1.5] lg:scale-[2] mt-12 lg:mt-0 lg:mr-12">
                      <PrincessIllustration />
                    </div>
                  </motion.div>
                </div>

                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 2.5, opacity: 1 }}
                  transition={{ delay: 0.6, type: 'spring' }}
                  className="mb-32 mt-12"
                >
                  <KnightIllustration />
                </motion.div>

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="w-full flex flex-col items-center pb-20"
                >
                  <Button 
                    size="lg" 
                    onClick={restartGame}
                    className="bg-white text-yellow-600 hover:bg-white/90 px-16 md:px-24 py-10 md:py-12 text-3xl md:text-4xl rounded-full shadow-2xl font-bold transition-all hover:scale-105 active:scale-95"
                  >
                    <RotateCcw className="mr-4 w-8 h-8 md:w-10 md:h-10" /> Play Again
                  </Button>
                  
                  <p className="text-white/70 text-sm md:text-base mt-12 font-bold tracking-[0.4em] uppercase">Created by Christopher Wu</p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shop Screen */}
        <AnimatePresence>
          {gameState.isShopOpen && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute inset-0 bg-[#f5f5f0] flex flex-col items-center justify-center p-8 overflow-y-auto"
            >
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
                      <span className="font-bold text-2xl tracking-tighter">{hudState.gold}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <ShopItem 
                    icon={<Sword className="w-6 h-6" />}
                    title="Sword Mastery"
                    level={hudState.weaponLevel}
                    cost={50 * hudState.weaponLevel}
                    description="Increase close combat damage."
                    onUpgrade={() => upgrade('weapon')}
                    canAfford={hudState.gold >= 50 * hudState.weaponLevel}
                  />
                  <ShopItem 
                    icon={<Crosshair className="w-6 h-6" />}
                    title="Bow Tuning"
                    level={hudState.bowLevel}
                    cost={50 * hudState.bowLevel}
                    description="Faster arrow reload speed."
                    onUpgrade={() => upgrade('bow')}
                    canAfford={hudState.gold >= 50 * hudState.bowLevel}
                  />
                  <ShopItem 
                    icon={<Shield className="w-6 h-6" />}
                    title="Royal Armor"
                    level={hudState.armorLevel}
                    cost={50 * hudState.armorLevel}
                    description="Increase maximum health."
                    onUpgrade={() => upgrade('armor')}
                    canAfford={hudState.gold >= 50 * hudState.armorLevel}
                  />
                  <ShopItem 
                    icon={<ArrowUp className="w-6 h-6" />}
                    title="Steed Training"
                    level={hudState.horseLevel}
                    cost={50 * hudState.horseLevel}
                    description="Increase travel speed."
                    onUpgrade={() => upgrade('horse')}
                    canAfford={hudState.gold >= 50 * hudState.horseLevel}
                  />
                </div>

                <Button 
                  className="w-full py-8 text-xl bg-[#5A5A40] hover:bg-[#4A4A30] text-white rounded-xl"
                  onClick={() => {
                    setGameState(prev => ({ ...prev, isShopOpen: false, isCinematic: true }));
                    playerRef.current.health = playerRef.current.maxHealth;
                    playerRef.current.ammo = playerRef.current.maxAmmo;
                    sceneryRef.current = [];
                    hudSyncTimerRef.current = 10;
                  }}
                >
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
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-[#5A5A40]" /> The Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Protect the princess at all costs. If the carriage breaks, you must continue on horseback.
          </CardContent>
        </Card>
        <Card className="bg-white/50 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sword className="w-5 h-5 text-[#5A5A40]" /> Combat
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <span className="font-bold text-[#5A5A40]">Q:</span> Sword swing for close enemies.<br/>
            <span className="font-bold text-[#5A5A40]">W:</span> Shoot arrows forward.<br/>
            <span className="font-bold text-[#5A5A40]">Space:</span> Pause/Unpause.
          </CardContent>
        </Card>
        <Card className="bg-white/50 border-none shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-5 h-5 text-[#5A5A40]" /> Upgrades
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Collect gold from defeated robbers to upgrade your gear at outposts.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ShopItem({ icon, title, level, cost, description, onUpgrade, canAfford }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-[#5A5A40]/10 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-[#5A5A40]/10 rounded-lg text-[#5A5A40]">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-sm">{title}</h3>
          <Badge variant="secondary" className="text-[10px] h-4">LVL {level}</Badge>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4 h-8">{description}</p>
      <Button 
        variant={canAfford ? "default" : "outline"}
        disabled={!canAfford}
        onClick={onUpgrade}
        className={`w-full text-xs h-8 ${canAfford ? 'bg-[#5A5A40] hover:bg-[#4A4A30] text-white' : ''}`}
      >
        Upgrade ({cost} G)
      </Button>
    </div>
  );
}

function PrincessIllustration() {
  return (
    <div className="relative w-40 h-48">
      {/* Dress */}
      <div className="absolute bottom-4 left-8 w-24 h-32 bg-pink-400 rounded-t-full border-2 border-pink-600 shadow-lg animate-bounce-high">
        {/* Dress Details */}
        <div className="absolute bottom-4 left-4 w-16 h-2 bg-pink-200/50 rounded-full" />
        <div className="absolute bottom-10 left-6 w-12 h-2 bg-pink-200/50 rounded-full" />
      </div>

      {/* Head */}
      <div className="absolute bottom-32 left-14 w-12 h-12 bg-[#ffe0bd] rounded-full border-2 border-pink-200 animate-bounce-high" style={{ animationDelay: '0.1s' }}>
        {/* Hair */}
        <div className="absolute -top-4 -left-2 w-16 h-10 bg-yellow-400 rounded-full border-2 border-yellow-600 -z-10" />
        <div className="absolute top-2 -left-4 w-6 h-12 bg-yellow-400 rounded-full border-2 border-yellow-600" />
        <div className="absolute top-2 -right-4 w-6 h-12 bg-yellow-400 rounded-full border-2 border-yellow-600" />
        
        {/* Crown */}
        <div className="absolute -top-10 left-2 w-8 h-6 flex gap-1 items-end">
          <div className="w-2 h-4 bg-yellow-500 rounded-t-full" />
          <div className="w-2 h-6 bg-yellow-500 rounded-t-full" />
          <div className="w-2 h-4 bg-yellow-500 rounded-t-full" />
        </div>

        {/* Face */}
        <div className="absolute top-5 left-3 w-1.5 h-1.5 bg-black rounded-full" />
        <div className="absolute top-5 right-3 w-1.5 h-1.5 bg-black rounded-full" />
        <div className="absolute top-8 left-4 w-4 h-2 border-b-2 border-pink-600 rounded-full" />
      </div>

      {/* Arms */}
      <div className="absolute bottom-28 left-4 w-8 h-2 bg-[#ffe0bd] rounded-full border border-pink-200 origin-right animate-bounce-high" style={{ animationDelay: '0.1s' }} />
      <div className="absolute bottom-28 right-4 w-8 h-2 bg-[#ffe0bd] rounded-full border border-pink-200 origin-left animate-bounce-high" style={{ animationDelay: '0.1s' }} />
    </div>
  );
}

function DefeatIllustration() {
  return (
    <div className="relative w-40 h-32">
      {/* Ground */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-red-900/50 rounded-full" />
      
      {/* Broken Sword */}
      <motion.div 
        initial={{ rotate: -45, x: -20, y: 20 }}
        animate={{ rotate: -35 }}
        className="absolute bottom-2 left-4"
      >
        {/* Hilt */}
        <div className="w-8 h-2 bg-amber-800 rounded-sm" />
        <div className="absolute top-[-4px] left-2 w-1 h-10 bg-amber-900 rounded-sm" />
        {/* Blade Fragment */}
        <div className="absolute top-[-2px] left-8 w-12 h-2 bg-slate-400 rounded-sm skew-x-12" />
      </motion.div>
      
      {/* Blade Tip */}
      <motion.div 
        initial={{ rotate: 15, x: 40, y: 25 }}
        className="absolute bottom-1 left-24 w-16 h-2 bg-slate-400 rounded-sm"
      />

      {/* Helmet */}
      <motion.div 
        initial={{ rotate: 110, y: 10 }}
        animate={{ y: [10, 12, 10] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-2 left-12 w-16 h-14 bg-slate-300 rounded-t-full border-2 border-slate-500"
      >
        <div className="absolute top-4 left-2 w-12 h-4 bg-slate-800/50 rounded-sm" /> {/* Visor slit */}
        <div className="absolute top-[-6px] left-6 w-4 h-6 bg-red-900 rounded-t-full" /> {/* Plume remnant */}
      </motion.div>
    </div>
  );
}

function KnightIllustration() {
  return (
    <div className="relative w-40 h-32">
      {/* Steed */}
      <div className="absolute bottom-0 left-4 w-24 h-16 bg-white rounded-t-3xl border-2 border-gray-300 shadow-inner animate-bounce-custom" />
      <div className="absolute bottom-12 left-20 w-12 h-12 bg-white rounded-full border-2 border-gray-300 animate-bounce-custom" style={{ animationDelay: '0.1s' }} />
      <div className="absolute bottom-16 left-28 w-8 h-4 bg-white rounded-full border-2 border-gray-300 origin-bottom-left animate-bounce-custom" style={{ animationDelay: '0.1s' }} />
      
      {/* Legs */}
      {[6, 12, 20, 26].map((left, i) => (
        <div 
          key={i}
          className="absolute bottom-0 w-2 bg-gray-200 animate-bounce-custom"
          style={{ left, height: '24px', animationDelay: `${i * 0.1}s` }}
        />
      ))}

      {/* Knight */}
      <div className="absolute bottom-14 left-8 w-16 h-20 bg-slate-200 rounded-t-xl border-2 border-slate-400 shadow-lg animate-bounce-custom" style={{ animationDelay: '0.2s' }} />
      <div className="absolute bottom-30 left-12 w-8 h-8 bg-slate-300 rounded-full border-2 border-slate-400 animate-bounce-custom" style={{ animationDelay: '0.2s' }} />
      
      {/* Helmet Visor */}
      <div className="absolute bottom-32 left-13 w-6 h-2 bg-slate-600 rounded-full animate-bounce-custom" style={{ animationDelay: '0.2s' }} />
      
      {/* Shield */}
      <div className="absolute bottom-16 left-0 w-12 h-14 bg-yellow-500 rounded-b-full border-2 border-yellow-600 shadow-md flex items-center justify-center animate-bounce-custom" style={{ animationDelay: '0.2s' }}>
        <div className="w-6 h-6 border-2 border-yellow-700 rounded-full" />
      </div>

      {/* Sword */}
      <div className="absolute bottom-18 left-20 origin-bottom animate-bounce-custom" style={{ animationDelay: '0.2s' }}>
        <div className="w-2 h-24 bg-slate-100 border border-slate-400 shadow-sm" />
        <div className="absolute bottom-0 -left-2 w-6 h-1.5 bg-yellow-600" />
      </div>
    </div>
  );
}
