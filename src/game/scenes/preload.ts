/**
 * preload.ts — central asset registration for the whole game.
 * Every scene that needs art calls loadAssets() in its preload().
 */
import Phaser from "phaser";

import bgMainStreet from "../assets/gen/bg-main-street.png";
import bgSaloon from "../assets/gen/bg-saloon.png";
import bgSaloonV2 from "../assets/gen/bg-saloon-v2.png";
import propTableRound from "../assets/gen/prop-table-round.png";
import propTableTilted from "../assets/gen/prop-table-tilted.png";
import propChairUpright from "../assets/gen/prop-chair-upright.png";
import propChairBroken from "../assets/gen/prop-chair-broken.png";
import mapImg from "../assets/gen/map-tombwood-creek.png";

import billyIdle from "../assets/gen/yello-billy-idle.png";
import billyDraw from "../assets/gen/yello-billy-draw.png";
import billyAim from "../assets/gen/yello-billy-aim.png";
import billyFlinch from "../assets/gen/yello-billy-flinch.png";
import billyFire from "../assets/gen/yello-billy-fire.png";
import billyHit from "../assets/gen/yello-billy-hit.png";
import billyDown from "../assets/gen/yello-billy-down.png";

import ryeIdle from "../assets/gen/three-finger-rye-idle.png";
import ryeDraw from "../assets/gen/three-finger-rye-draw.png";
import ryeAim from "../assets/gen/three-finger-rye-aim.png";
import ryeFlinch from "../assets/gen/three-finger-rye-flinch.png";
import ryeFire from "../assets/gen/three-finger-rye-fire.png";
import ryeHit from "../assets/gen/three-finger-rye-hit.png";
import ryeDown from "../assets/gen/three-finger-rye-down.png";

import snakeIdle from "../assets/gen/sam-snakeeyes-idle.png";
import snakeDraw from "../assets/gen/sam-snakeeyes-draw.png";
import snakeAim from "../assets/gen/sam-snakeeyes-aim.png";
import snakeFlinch from "../assets/gen/sam-snakeeyes-flinch.png";
import snakeFire from "../assets/gen/sam-snakeeyes-fire.png";
import snakeHit from "../assets/gen/sam-snakeeyes-hit.png";
import snakeDown from "../assets/gen/sam-snakeeyes-down.png";

import bgGamblingDen from "../assets/gen/bg-gambling-den.png";
import propPokerTable from "../assets/gen/prop-poker-table.png";

import posterBilly from "../assets/gen/poster-yello-billy.png";
import posterRye from "../assets/gen/poster-three-finger-rye.png";
import posterSnakeeyes from "../assets/gen/poster-sam-snakeeyes.png";
import posterGoose from "../assets/gen/poster-greg-goose.png";
import posterDan from "../assets/gen/poster-dandy-dan.png";
import posterBart from "../assets/gen/poster-black-bart.png";

import npcMatron from "../assets/gen/npc-matron.png";
import npcMatronFlinch from "../assets/gen/npc-matron-flinch.png";
import npcMatronHappy from "../assets/gen/npc-matron-happy.png";
import npcOldtimer from "../assets/gen/npc-oldtimer.png";
import npcOldtimerFlinch from "../assets/gen/npc-oldtimer-flinch.png";
import npcOldtimerHappy from "../assets/gen/npc-oldtimer-happy.png";
import npcLaborer from "../assets/gen/npc-laborer.png";
import npcLaborerFlinch from "../assets/gen/npc-laborer-flinch.png";
import npcLaborerHappy from "../assets/gen/npc-laborer-happy.png";
import npcTownman from "../assets/gen/npc-townman.png";
import npcTownmanFlinch from "../assets/gen/npc-townman-flinch.png";
import npcTownmanHappy from "../assets/gen/npc-townman-happy.png";

import repStew from "../assets/gen/rep-mainstreet.png";
import repStewFlinch from "../assets/gen/rep-mainstreet-flinch.png";
import repStewHappy from "../assets/gen/rep-mainstreet-happy.png";
import repBarman from "../assets/gen/rep-saloon.png";
import repBarmanFlinch from "../assets/gen/rep-saloon-flinch.png";
import repBarmanHappy from "../assets/gen/rep-saloon-happy.png";
import repBen from "../assets/gen/rep-gambling-den.png";
import repBenFlinch from "../assets/gen/rep-gambling-den-flinch.png";
import repBenHappy from "../assets/gen/rep-gambling-den-happy.png";

export function loadAssets(scene: Phaser.Scene): void {
  const imgs: Record<string, string> = {
    "bg-main-street": bgMainStreet,
    "bg-saloon": bgSaloon,
    "bg-saloon-v2": bgSaloonV2,
    "prop-table-round": propTableRound,
    "prop-table-tilted": propTableTilted,
    "prop-chair-upright": propChairUpright,
    "prop-chair-broken": propChairBroken,
    "map": mapImg,
    "yello-billy-idle": billyIdle,
    "yello-billy-draw": billyDraw,
    "yello-billy-aim": billyAim,
    "yello-billy-flinch": billyFlinch,
    "yello-billy-fire": billyFire,
    "yello-billy-hit": billyHit,
    "yello-billy-down": billyDown,
    "three-finger-rye-idle": ryeIdle,
    "three-finger-rye-draw": ryeDraw,
    "three-finger-rye-aim": ryeAim,
    "three-finger-rye-flinch": ryeFlinch,
    "three-finger-rye-fire": ryeFire,
    "three-finger-rye-hit": ryeHit,
    "three-finger-rye-down": ryeDown,
    "sam-snakeeyes-idle": snakeIdle,
    "sam-snakeeyes-draw": snakeDraw,
    "sam-snakeeyes-aim": snakeAim,
    "sam-snakeeyes-flinch": snakeFlinch,
    "sam-snakeeyes-fire": snakeFire,
    "sam-snakeeyes-hit": snakeHit,
    "sam-snakeeyes-down": snakeDown,
    "bg-gambling-den": bgGamblingDen,
    "prop-poker-table": propPokerTable,
    "poster-yello-billy": posterBilly,
    "poster-three-finger-rye": posterRye,
    "poster-sam-snakeeyes": posterSnakeeyes,
    "poster-greg-goose": posterGoose,
    "poster-dandy-dan": posterDan,
    "poster-black-bart": posterBart,
    "npc-matron": npcMatron,
    "npc-matron-flinch": npcMatronFlinch,
    "npc-matron-happy": npcMatronHappy,
    "npc-oldtimer": npcOldtimer,
    "npc-oldtimer-flinch": npcOldtimerFlinch,
    "npc-oldtimer-happy": npcOldtimerHappy,
    "npc-laborer": npcLaborer,
    "npc-laborer-flinch": npcLaborerFlinch,
    "npc-laborer-happy": npcLaborerHappy,
    "npc-townman": npcTownman,
    "npc-townman-flinch": npcTownmanFlinch,
    "npc-townman-happy": npcTownmanHappy,
    "rep-mainstreet": repStew,
    "rep-mainstreet-flinch": repStewFlinch,
    "rep-mainstreet-happy": repStewHappy,
    "rep-saloon": repBarman,
    "rep-saloon-flinch": repBarmanFlinch,
    "rep-saloon-happy": repBarmanHappy,
    "rep-gambling-den": repBen,
    "rep-gambling-den-flinch": repBenFlinch,
    "rep-gambling-den-happy": repBenHappy,
  };
  for (const [key, url] of Object.entries(imgs)) {
    if (!scene.textures.exists(key)) scene.load.image(key, url);
  }
}
