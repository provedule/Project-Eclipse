import { Dimension, MinecraftBlockTypes, world } from "@minecraft/server";

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

  if (source.typeId !== 'eclipse:meteor') return;

  // dont explode blocks
  const blocks = event.getImpactedBlocks().map((coord) => findAirBlock(coord, event.dimension));
  event.setImpactedBlocks(blocks);

  // asteroid
  source.dimension.spawnEntity('eclipse:asteroid', source.location);
  for (const player of source.dimension.getPlayers({ closest: 75 })) {
    player.playSound('mob.warden.emerge');
  }
});
