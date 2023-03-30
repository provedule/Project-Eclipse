import { Dimension, EntityScaleComponent, MinecraftBlockTypes, MinecraftEffectTypes, MolangVariableMap, TicksPerSecond, Vector, system, world } from "@minecraft/server";

/**
 * @param {import("@minecraft/server").Vector3} coord
 * @param {Dimension} dimension
 */
function findAirBlock (coord, dimension) {
  while (true) {
    const block = dimension.getBlock(coord);
    if (block.type === MinecraftBlockTypes.air) return coord;
    else coord.y++;
  };
};

world.events.beforeExplosion.subscribe((event) => {
  const { source } = event;
  const { dimension, location, typeId } = source;

  if (typeId !== 'eclipse:meteor') return;

  // dont explode blocks
  const blocks = event.getImpactedBlocks().map((coord) => findAirBlock(coord, event.dimension));
  event.setImpactedBlocks(blocks);

  // asteroid
  for (const player of dimension.getPlayers({ closest: 75 })) {
    player.playSound('mob.warden.emerge');
    player.runCommandAsync("camerashake @s 1.0 1.0")
  };
  
  const deathExplosionMolangVariables = new MolangVariableMap();
  deathExplosionMolangVariables.setVector3("variable.aabb", new Vector(10, 10, 10));

  dimension.spawnParticle("eclipse:dragon_death_explosion_emitter", location, deathExplosionMolangVariables);
  dimension.spawnParticle("eclipse:campfire_smoke_particle", location, new MolangVariableMap());
});
