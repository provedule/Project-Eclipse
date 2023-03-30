import { Dimension, EntityScaleComponent, MinecraftBlockTypes, MinecraftEffectTypes, TicksPerSecond, Vector, system, world } from "@minecraft/server";

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
  const asteroid = dimension.spawnEntity('eclipse:asteroid', location);
  for (const player of dimension.getPlayers({ closest: 75 })) {
    player.playSound('mob.warden.emerge');
  };
  // slow falling incase it blows up in the air
  asteroid.addEffect(MinecraftEffectTypes.slowFalling, 10, 1, false);

  const id = system.runInterval(() => {
    /**
     * @type {EntityScaleComponent}
     */
    const scale = asteroid.getComponent(EntityScaleComponent.componentId);
    const closest = scale.value / 2.25;

    (async () => {
      for (const player of dimension.getPlayers({ closest: closest * 4 })) {
        const distance = Vector.subtract(player.location, asteroid.location).length();
        const amplifer = closest / distance * 10;
        player.runCommandAsync(`camerashake add @s ${amplifer > 4 ? 4 : amplifer} 0.05`)
      };
    })().catch(console.log);

    (async () => {
      for (const player of dimension.getPlayers({ closest })) {
        const effects = player.getEffects();
        if (effects.findIndex(effect => effect.displayName === MinecraftEffectTypes.darkness.getName()) === -1) {
          player.addEffect(MinecraftEffectTypes.darkness, TicksPerSecond, 0, false);
        }
      };
    })().catch(console.log);
  });

  system.runTimeout(() => system.clearRun(id), 7 * TicksPerSecond);
});
