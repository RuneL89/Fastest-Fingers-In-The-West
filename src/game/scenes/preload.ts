/**
 * preload.ts — central asset registration for the whole game.
 * Every scene that needs art calls loadAssets() in its preload().
 */
import Phaser from "phaser";

import bgMainStreet from "../assets/gen/bg-main-street.png";
import mapImg from "../assets/gen/map-tombwood-creek.png";

import billyIdle from "../assets/gen/yello-billy-idle.png";
import billyDraw from "../assets/gen/yello-billy-draw.png";
import billyAim from "../assets/gen/yello-billy-aim.png";
import billyFlinch from "../assets/gen/yello-billy-flinch.png";
import billyFire from "../assets/gen/yello-billy-fire.png";
import billyHit from "../assets/gen/yello-billy-hit.png";
import billyDown from "../assets/gen/yello-billy-down.png";

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

export function loadAssets(scene: Phaser.Scene): void {
  const imgs: Record<string, string> = {
    "bg-main-street": bgMainStreet,
    "map": mapImg,
    "yello-billy-idle": billyIdle,
    "yello-billy-draw": billyDraw,
    "yello-billy-aim": billyAim,
    "yello-billy-flinch": billyFlinch,
    "yello-billy-fire": billyFire,
    "yello-billy-hit": billyHit,
    "yello-billy-down": billyDown,
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
  };
  for (const [key, url] of Object.entries(imgs)) {
    if (!scene.textures.exists(key)) scene.load.image(key, url);
  }
}
