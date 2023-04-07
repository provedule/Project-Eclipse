import { Dimension, EntityScaleComponent, MinecraftBlockTypes, MinecraftEffectTypes, TicksPerSecond, Vector, system, world } from "@minecraft/server";

/**
 * @param {import("@minecraft/server").Vector3} location
 * @param {Dimension} dimension
 */
function findAirBlock (location, dimension) {
  while (true) {
    const block = dimension.getBlock(location);
    if (block.type === MinecraftBlockTypes.air) return location;
    else location.y++;
  };
};

world.events.beforeExplosion.subscribe((event) => {
  const { source } = event;
  const { dimension, location, typeId } = source;

  if (typeId !== 'eclipse:meteor') return;

  // dont explode blocks
  const blocks = event.getImpactedBlocks().map((location) => findAirBlock(location, event.dimension));
  event.setImpactedBlocks(blocks);

  world.playSound("asteroid.explode", {
    location: location,
    volume: 100
  })

});
