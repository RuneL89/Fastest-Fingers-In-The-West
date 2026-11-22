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

import gooseIdle from "../assets/gen/greg-goose-idle.png";
import gooseDraw from "../assets/gen/greg-goose-draw.png";
import gooseAim from "../assets/gen/greg-goose-aim.png";
import gooseFlinch from "../assets/gen/greg-goose-flinch.png";
import gooseFire from "../assets/gen/greg-goose-fire.png";
import gooseHit from "../assets/gen/greg-goose-hit.png";
import gooseDown from "../assets/gen/greg-goose-down.png";

import danIdle from "../assets/gen/dandy-dan-idle.png";
import danDraw from "../assets/gen/dandy-dan-draw.png";
import danAim from "../assets/gen/dandy-dan-aim.png";
import danFlinch from "../assets/gen/dandy-dan-flinch.png";
import danFire from "../assets/gen/dandy-dan-fire.png";
import danHit from "../assets/gen/dandy-dan-hit.png";
import danDown from "../assets/gen/dandy-dan-down.png";

import bartIdle from "../assets/gen/black-bart-idle.png";
import bartDraw from "../assets/gen/black-bart-draw.png";
import bartAim from "../assets/gen/black-bart-aim.png";
import bartFlinch from "../assets/gen/black-bart-flinch.png";
import bartFire from "../assets/gen/black-bart-fire.png";
import bartHit from "../assets/gen/black-bart-hit.png";
import bartDown from "../assets/gen/black-bart-down.png";

import bgGamblingDen from "../assets/gen/bg-gambling-den.png";
import propPokerTable from "../assets/gen/prop-poker-table.png";
import bgGoldMine from "../assets/gen/bg-gold-mine.png";
import propMineCart from "../assets/gen/prop-mine-cart.png";
import propMiningCrate from "../assets/gen/prop-mining-crate.png";
import bgChurch from "../assets/gen/bg-church.png";
import propChurchPew from "../assets/gen/prop-church-pew.png";
import bgTownHall from "../assets/gen/bg-town-hall.png";

import posterBilly from "../assets/gen/poster-yello-billy.png";
import posterRye from "../assets/gen/poster-three-finger-rye.png";
import posterSnakeeyes from "../assets/gen/poster-sam-snakeeyes.png";
import posterGoose from "../assets/gen/poster-greg-goose.png";
import posterDan from "../assets/gen/poster-dandy-dan.png";
import posterBart from "../assets/gen/poster-black-bart.png";

import npcMatron from "../assets/gen/npc-matron.png";
import npcMatronFlinch from "../assets/gen/npc-matron-flinch.png";
import npcMatronHappy from "../assets/gen/npc-matron-happy.png";
import npcMatronCrying from "../assets/gen/npc-matron-crying.png";
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
import repMiner from "../assets/gen/rep-gold-mine.png";
import repMinerFlinch from "../assets/gen/rep-gold-mine-flinch.png";
import repMinerHappy from "../assets/gen/rep-gold-mine-happy.png";
import repPriest from "../assets/gen/rep-church.png";
import repPriestFlinch from "../assets/gen/rep-church-flinch.png";
import repPriestHappy from "../assets/gen/rep-church-happy.png";
import repMayor from "../assets/gen/rep-town-hall.png";
import repMayorFlinch from "../assets/gen/rep-town-hall-flinch.png";
import repMayorHappy from "../assets/gen/rep-town-hall-happy.png";

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
    "greg-goose-idle": gooseIdle,
    "greg-goose-draw": gooseDraw,
    "greg-goose-aim": gooseAim,
    "greg-goose-flinch": gooseFlinch,
    "greg-goose-fire": gooseFire,
    "greg-goose-hit": gooseHit,
    "greg-goose-down": gooseDown,
    "dandy-dan-idle": danIdle,
    "dandy-dan-draw": danDraw,
    "dandy-dan-aim": danAim,
    "dandy-dan-flinch": danFlinch,
    "dandy-dan-fire": danFire,
    "dandy-dan-hit": danHit,
    "dandy-dan-down": danDown,
    "black-bart-idle": bartIdle,
    "black-bart-draw": bartDraw,
    "black-bart-aim": bartAim,
    "black-bart-flinch": bartFlinch,
    "black-bart-fire": bartFire,
    "black-bart-hit": bartHit,
    "black-bart-down": bartDown,
    "bg-gambling-den": bgGamblingDen,
    "prop-poker-table": propPokerTable,
    "bg-gold-mine": bgGoldMine,
    "prop-mine-cart": propMineCart,
    "prop-mining-crate": propMiningCrate,
    "bg-church": bgChurch,
    "prop-church-pew": propChurchPew,
    "bg-town-hall": bgTownHall,
    "poster-yello-billy": posterBilly,
    "poster-three-finger-rye": posterRye,
    "poster-sam-snakeeyes": posterSnakeeyes,
    "poster-greg-goose": posterGoose,
    "poster-dandy-dan": posterDan,
    "poster-black-bart": posterBart,
    "npc-matron": npcMatron,
    "npc-matron-flinch": npcMatronFlinch,
    "npc-matron-happy": npcMatronHappy,
    "npc-matron-crying": npcMatronCrying,
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
    "rep-gold-mine": repMiner,
    "rep-gold-mine-flinch": repMinerFlinch,
    "rep-gold-mine-happy": repMinerHappy,
    "rep-church": repPriest,
    "rep-church-flinch": repPriestFlinch,
    "rep-church-happy": repPriestHappy,
    "rep-town-hall": repMayor,
    "rep-town-hall-flinch": repMayorFlinch,
    "rep-town-hall-happy": repMayorHappy,
  };
  for (const [key, url] of Object.entries(imgs)) {
    if (!scene.textures.exists(key)) scene.load.image(key, url);
  }
}
