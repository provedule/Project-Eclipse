import { world, system, MolangVariableMap, MinecraftBlockTypes, Player } from "@minecraft/server";
import { ActionFormData } from "./Forms/Forms.js";
import { Button } from "./Forms/Components.js";
system.events.beforeWatchdogTerminate.subscribe(
	(data) => data.cancel = true,
);

const allowedBlocks = [
	"test:structure_builder_n",
	"test:structure_builder_s",
	"test:structure_builder_r",
	"test:structure_builder_l",
];
world.events.beforeItemUseOn.subscribe(
    (data) => {
		const { source: player, item } = data;
        const block = player.getBlockFromViewDirection();
		if(player.isSneaking) return;
		if(allowedBlocks.includes(block?.typeId)) data.cancel = true;
		
        switch(block?.typeId) {
            case "test:structure_builder_n":
                build(player, block, false, false, true, false);
			break;
			case "test:structure_builder_s":
                build(player, block, false, false, false, true);
			break;
            case "test:structure_builder_r":
                build(player, block, false, true, false, false);
			break;
            case "test:structure_builder_l":
                build(player, block, true, false, false, false);
			break;
        };
    },
);

const build = ( player, block, l, r, n, s ) => {
	if (player.hasTag("inUI")) return;
	
	player.addTag("inUI");
    new ActionFormData({ title: "Choose a Structure" })
    .addButtons(
		[
			new Button(
				{
					id: "4way",
					text: "4 Way\n x5 +  x23 +  x55",
				}
			),
			new Button(
				{
					id: "chamber",
					text: "Chamber\n x5 +  x23 +  x55",
				}
			),
			new Button(
				{
					id: "anterchamber",
					text: "Anterchamber\n x5 +  x23 +  x55",
				}
			),
			new Button(
				{
					id: "battery",
					text: "Battery\n x5 +  x23 +  x55",
				}
			),
			new Button(
				{
					id: "craftingroom",
					text: "Crafting Room\n x5 +  x23 +  x55",
				}
			),
			new Button(
				{
					id: "hallway",
					text: "Hallway\n x5 +  x23 +  x55",
				}
			),
			new Button(
				{
					id: "turn_l",
					text: "Turn Left\n x5 +  x23 +  x55",
				}
			),
			new Button(
				{
					id: "turn_r",
					text: "Turn Right\n x5 +  x23 +  x55",
				}
			),
		],
	)
    .open(player)
    .then(
        (response) => {
			player.removeTag("inUI");
            if(response.canceled) return;
			
			if (
				player.getItemCount( "lunar:gold_insulation" ) < 5
				|| player.getItemCount( "lunar:scrap_metal" ) < 23
				|| player.getItemCount( "lunar:steel_sheet" ) < 55
			) return player.sendMessage( "§cNot enough items!§r" );
					
			player.runCommandAsync( "clear @s lunar:gold_insulation 0 5" );
			player.runCommandAsync( "clear @s lunar:scrap_metal 0 23" );
			player.runCommandAsync( "clear @s lunar:steel_sheet 0 55" );
			
            switch(response.selection.customId) {
				case "4way":
                    if (l) {
						const blocks = getBlocks(
							{
								x: block.location.x + 17,
								y: block.location.y - 1,
								z: block.location.z - 12,
							},
							{
								x: block.location.x + 1,
								y: block.location.y + 11,
								z: block.location.z + 12,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_4way "
							+ (block.location.x + 1) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 8)
							+ " 0_degrees none"
                        );
                    } else if (r) {
                        const blocks = getBlocks(
							{
								x: block.location.x - 17,
								y: block.location.y - 1,
								z: block.location.z - 12,
							},
							{
								x: block.location.x - 1,
								y: block.location.y + 11,
								z: block.location.z + 12,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_4way "
                            + (block.location.x - 17) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 8)
							+ " 0_degrees none"
                        );
                    } else if (n) {
						const blocks = getBlocks(
							{
								x: block.location.x - 12,
								y: block.location.y - 1,
								z: block.location.z + 17,
							},
							{
								x: block.location.x + 12,
								y: block.location.y + 11,
								z: block.location.z + 1,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_4way "
                            + (block.location.x - 8) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z + 1)
							+ " 0_degrees none"
                        );
                    } else if (s) {
						const blocks = getBlocks(
							{
								x: block.location.x - 12,
								y: block.location.y - 1,
								z: block.location.z - 17,
							},
							{
								x: block.location.x + 12,
								y: block.location.y + 11,
								z: block.location.z - 1,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_4way "
                            + (block.location.x - 8) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 17)
							+ " 0_degrees none"
                        );
                    };
                break;
				case "chamber":
					/*if (
						player.getItemCount( "minecraft:log" ) < 8
						|| player.getItemCount( "minecraft:stick" ) < 16
					) return player.sendMessage( "§cNot enough items!§r" );
					
					player.runCommandAsync( "clear @s log 0 8" );
					player.runCommandAsync( "clear @s stick 0 16" );*/
					
                    if (l) {
						const blocks = getBlocks(
							{
								x: block.location.x + 17,
								y: block.location.y - 1,
								z: block.location.z - 12,
							},
							{
								x: block.location.x + 1,
								y: block.location.y + 11,
								z: block.location.z + 12,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_chamber "
							+ (block.location.x + 1) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 4)
							+ " 0_degrees none"
                        );
                    } else if (r) {
                        const blocks = getBlocks(
							{
								x: block.location.x - 17,
								y: block.location.y - 1,
								z: block.location.z - 12,
							},
							{
								x: block.location.x - 1,
								y: block.location.y + 11,
								z: block.location.z + 12,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_chamber "
                            + (block.location.x - 9) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 4)
							+ " 0_degrees none"
                        );
                    } else if (n) {
						const blocks = getBlocks(
							{
								x: block.location.x - 12,
								y: block.location.y - 1,
								z: block.location.z + 17,
							},
							{
								x: block.location.x + 12,
								y: block.location.y + 11,
								z: block.location.z + 1,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_chamber "
                            + (block.location.x - 4) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z + 1)
							+ " 90_degrees none"
                        );
                    } else if (s) {
						const blocks = getBlocks(
							{
								x: block.location.x - 12,
								y: block.location.y - 1,
								z: block.location.z - 17,
							},
							{
								x: block.location.x + 12,
								y: block.location.y + 11,
								z: block.location.z - 1,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_chamber "
                            + (block.location.x - 4) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 9)
							+ " 90_degrees none"
                        );
                    };
                break;
				case "anterchamber":
					/*if (
						player.getItemCount( "minecraft:log" ) < 8
						|| player.getItemCount( "minecraft:stick" ) < 16
					) return player.sendMessage( "§cNot enough items!§r" );
					
					player.runCommandAsync( "clear @s log 0 8" );
					player.runCommandAsync( "clear @s stick 0 16" );*/
					
                    if (l) {
						const blocks = getBlocks(
							{
								x: block.location.x + 17,
								y: block.location.y - 1,
								z: block.location.z - 12,
							},
							{
								x: block.location.x + 1,
								y: block.location.y + 11,
								z: block.location.z + 12,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_antechamber "
							+ (block.location.x + 1) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 17)
							+ " 0_degrees none"
                        );
                    } else if (r) {
                        const blocks = getBlocks(
							{
								x: block.location.x - 17,
								y: block.location.y - 1,
								z: block.location.z - 12,
							},
							{
								x: block.location.x - 1,
								y: block.location.y + 11,
								z: block.location.z + 12,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_antechamber "
                            + (block.location.x - 35) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 17)
							+ " 0_degrees none"
                        );
                    } else if (n) {
						const blocks = getBlocks(
							{
								x: block.location.x - 17,
								y: block.location.y - 1,
								z: block.location.z + 35,
							},
							{
								x: block.location.x + 17,
								y: block.location.y + 27,
								z: block.location.z + 1,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_antechamber "
                            + (block.location.x - 17) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z + 1)
							+ " 0_degrees none"
                        );
                    } else if (s) {
						const blocks = getBlocks(
							{
								x: block.location.x - 12,
								y: block.location.y - 1,
								z: block.location.z - 17,
							},
							{
								x: block.location.x + 12,
								y: block.location.y + 11,
								z: block.location.z - 1,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_antechamber "
                            + (block.location.x - 17) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 35)
							+ " 0_degrees none"
                        );
                    };
                break;
				case "battery":
					/*if (
						player.getItemCount( "minecraft:log" ) < 8
						|| player.getItemCount( "minecraft:stick" ) < 16
					) return player.sendMessage( "§cNot enough items!§r" );
					
					player.runCommandAsync( "clear @s log 0 8" );
					player.runCommandAsync( "clear @s stick 0 16" );*/
					
                    if (l) {
						const blocks = getBlocks(
							{
								x: block.location.x + 6,
								y: block.location.y - 1,
								z: block.location.z - 2,
							},
							{
								x: block.location.x + 1,
								y: block.location.y + 5,
								z: block.location.z + 2,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_battery "
							+ (block.location.x + 1) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 2)
							+ " 0_degrees none block_by_block 5"
                        );
                    } else if (r) {
                        const blocks = getBlocks(
							{
								x: block.location.x - 6,
								y: block.location.y - 1,
								z: block.location.z - 2,
							},
							{
								x: block.location.x - 1,
								y: block.location.y + 5,
								z: block.location.z + 2,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_battery "
                            + (block.location.x - 6) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 2)
							+ " 180_degrees none block_by_block 5"
                        );
                    } else if (n) {
						const blocks = getBlocks(
							{
								x: block.location.x - 2,
								y: block.location.y - 1,
								z: block.location.z + 6,
							},
							{
								x: block.location.x + 2,
								y: block.location.y + 5,
								z: block.location.z + 1,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_battery "
                            + (block.location.x - 2) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z + 1)
							+ " 90_degrees none block_by_block 5"
                        );
                    } else if (s) {
						const blocks = getBlocks(
							{
								x: block.location.x - 2,
								y: block.location.y - 1,
								z: block.location.z - 6,
							},
							{
								x: block.location.x + 2,
								y: block.location.y + 5,
								z: block.location.z - 1,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_battery "
                            + (block.location.x - 2) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 6)
							+ " 270_degrees none block_by_block 5"
                        );
                    };
                break;
				case "craftingroom":
					/*if (
						player.getItemCount( "minecraft:log" ) < 8
						|| player.getItemCount( "minecraft:stick" ) < 16
					) return player.sendMessage( "§cNot enough items!§r" );
					
					player.runCommandAsync( "clear @s log 0 8" );
					player.runCommandAsync( "clear @s stick 0 16" );*/
					
                    if (l) {
						const blocks = getBlocks(
							{
								x: block.location.x + 15,
								y: block.location.y - 1,
								z: block.location.z - 12,
							},
							{
								x: block.location.x + 1,
								y: block.location.y + 11,
								z: block.location.z + 12,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_craftingroom "
							+ (block.location.x + 1) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 14)
							+ " 0_degrees none"
                        );
                    } else if (r) {
                        const blocks = getBlocks(
							{
								x: block.location.x - 15,
								y: block.location.y - 1,
								z: block.location.z - 12,
							},
							{
								x: block.location.x - 1,
								y: block.location.y + 11,
								z: block.location.z + 12,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_craftingroom "
                            + (block.location.x - 15) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 14)
							+ " 180_degrees none"
                        );
                    } else if (n) {
						const blocks = getBlocks(
							{
								x: block.location.x - 12,
								y: block.location.y - 1,
								z: block.location.z + 15,
							},
							{
								x: block.location.x + 12,
								y: block.location.y + 11,
								z: block.location.z + 1,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_craftingroom "
                            + (block.location.x - 14) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z + 1)
							+ " 90_degrees none"
                        );
                    } else if (s) {
						const blocks = getBlocks(
							{
								x: block.location.x - 12,
								y: block.location.y - 1,
								z: block.location.z - 15,
							},
							{
								x: block.location.x + 12,
								y: block.location.y + 11,
								z: block.location.z - 1,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_craftingroom "
                            + (block.location.x - 14) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 15)
							+ " 270_degrees none"
                        );
                    };
                break;
				case "hallway":
					/*if (
						player.getItemCount( "minecraft:log" ) < 8
						|| player.getItemCount( "minecraft:stick" ) < 16
					) return player.sendMessage( "§cNot enough items!§r" );
					
					player.runCommandAsync( "clear @s log 0 8" );
					player.runCommandAsync( "clear @s stick 0 16" );*/
					
                    if (l) {
						const blocks = getBlocks(
							{
								x: block.location.x + 11,
								y: block.location.y - 1,
								z: block.location.z - 2,
							},
							{
								x: block.location.x + 1,
								y: block.location.y + 5,
								z: block.location.z + 2,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_hallway "
							+ (block.location.x + 1) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 3)
							+ " 0_degrees none"
                        );
                    } else if (r) {
                        const blocks = getBlocks(
							{
								x: block.location.x - 11,
								y: block.location.y - 1,
								z: block.location.z - 2,
							},
							{
								x: block.location.x - 1,
								y: block.location.y + 5,
								z: block.location.z + 2,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_hallway "
                            + (block.location.x - 11) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 3)
							+ " 90_degrees none"
                        );
                    } else if (n) {
						const blocks = getBlocks(
							{
								x: block.location.x - 2,
								y: block.location.y - 1,
								z: block.location.z + 11,
							},
							{
								x: block.location.x + 2,
								y: block.location.y + 5,
								z: block.location.z + 1,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_hallway "
                            + (block.location.x - 3) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z + 1)
							+ " 180_degrees none"
                        );
                    } else if (s) {
						const blocks = getBlocks(
							{
								x: block.location.x - 2,
								y: block.location.y - 1,
								z: block.location.z - 11,
							},
							{
								x: block.location.x + 2,
								y: block.location.y + 5,
								z: block.location.z - 1,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_hallway "
                            + (block.location.x - 3) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 11)
							+ " 0_degrees none"
                        );
                    };
                break;
				case "turn_l":
					/*if (
						player.getItemCount( "minecraft:log" ) < 8
						|| player.getItemCount( "minecraft:stick" ) < 16
					) return player.sendMessage( "§cNot enough items!§r" );
					
					player.runCommandAsync( "clear @s log 0 8" );
					player.runCommandAsync( "clear @s stick 0 16" );*/
					
                    if (l) {
						const blocks = getBlocks(
							{
								x: block.location.x + 17,
								y: block.location.y - 1,
								z: block.location.z - 12,
							},
							{
								x: block.location.x + 1,
								y: block.location.y + 11,
								z: block.location.z + 12,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_turn "
							+ (block.location.x + 1) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 8)
							+ " 180_degrees none"
                        );
                    } else if (r) {
                        const blocks = getBlocks(
							{
								x: block.location.x - 17,
								y: block.location.y - 1,
								z: block.location.z - 12,
							},
							{
								x: block.location.x - 1,
								y: block.location.y + 11,
								z: block.location.z + 12,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_turn "
                            + (block.location.x - 12) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 3)
							+ " 0_degrees none"
                        );
                    } else if (n) {
						const blocks = getBlocks(
							{
								x: block.location.x - 12,
								y: block.location.y - 1,
								z: block.location.z + 17,
							},
							{
								x: block.location.x + 12,
								y: block.location.y + 11,
								z: block.location.z + 1,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_turn "
                            + (block.location.x - 3) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z + 1)
							+ " 270_degrees none"
                        );
                    } else if (s) {
						const blocks = getBlocks(
							{
								x: block.location.x - 12,
								y: block.location.y - 1,
								z: block.location.z - 17,
							},
							{
								x: block.location.x + 12,
								y: block.location.y + 11,
								z: block.location.z - 1,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_turn "
                            + (block.location.x - 8) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 12)
							+ " 90_degrees none"
                        );
                    };
                break;
				case "turn_r":
					/*if (
						player.getItemCount( "minecraft:log" ) < 8
						|| player.getItemCount( "minecraft:stick" ) < 16
					) return player.sendMessage( "§cNot enough items!§r" );
					
					player.runCommandAsync( "clear @s log 0 8" );
					player.runCommandAsync( "clear @s stick 0 16" );*/
					
                    if (l) {
						const blocks = getBlocks(
							{
								x: block.location.x + 17,
								y: block.location.y - 1,
								z: block.location.z - 12,
							},
							{
								x: block.location.x + 1,
								y: block.location.y + 11,
								z: block.location.z + 12,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_turn "
							+ (block.location.x + 1) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 3)
							+ " 90_degrees none"
                        );
                    } else if (r) {
                        const blocks = getBlocks(
							{
								x: block.location.x - 17,
								y: block.location.y - 1,
								z: block.location.z - 12,
							},
							{
								x: block.location.x - 1,
								y: block.location.y + 11,
								z: block.location.z + 12,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_turn "
                            + (block.location.x - 12) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 8)
							+ " 270_degrees none"
                        );
                    } else if (n) {
						const blocks = getBlocks(
							{
								x: block.location.x - 12,
								y: block.location.y - 1,
								z: block.location.z + 17,
							},
							{
								x: block.location.x + 12,
								y: block.location.y + 11,
								z: block.location.z + 1,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_turn "
                            + (block.location.x - 8) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z + 1)
							+ " 180_degrees none"
                        );
                    } else if (s) {
						const blocks = getBlocks(
							{
								x: block.location.x - 12,
								y: block.location.y - 1,
								z: block.location.z - 17,
							},
							{
								x: block.location.x + 12,
								y: block.location.y + 11,
								z: block.location.z - 1,
							},
							block.dimension,
						);
						
						if (blocks.length > 0) {
							for (const block of blocks) {
								spawnEdgeParticles(
									{
										x: block.location.x,
										y: block.location.y,
										z: block.location.z,
									},
									{
										x: block.location.x + 1,
										y: block.location.y + 1,
										z: block.location.z + 1,
									},
									block.dimension,
									"test:red",
								);
							};
							
							return player.sendMessage("Blocks in the direction!");
						};
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_turn "
                            + (block.location.x - 3) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 12)
							+ " 0_degrees none"
                        );
                    };
                break;
			};
        },
    );
};

const getBlocks = (a, b, dimension) => {
    const minX = Math.min(a.x, b.x);
    const minY = Math.min(a.y, b.y);
    const minZ = Math.min(a.z, b.z);
    const maxX = Math.max(a.x, b.x);
    const maxY = Math.max(a.y, b.y);
    const maxZ = Math.max(a.z, b.z);
    
    const blocks = [];
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            for (let z = minZ; z <= maxZ; z++) {
                const block = dimension.getBlock({ x, y, z });
                if (block?.typeId != "minecraft:air" && !allowedBlocks.includes(block?.typeId)) blocks.push(block);
            };
        };
    };
    
    return blocks;
};

function spawnEdgeParticles(a, b, dimension, effectName) {
	const minX = Math.min(a.x, b.x);
	const minY = Math.min(a.y, b.y);
	const minZ = Math.min(a.z, b.z);
	const maxX = Math.max(a.x, b.x);
	const maxY = Math.max(a.y, b.y);
	const maxZ = Math.max(a.z, b.z);

	for (let x = minX; x <= maxX; x++) {
		for (let y = minY; y <= maxY; y++) {
			dimension.spawnParticle(
				effectName,
				{
					x,
					y,
					z: minZ,
				},
				new MolangVariableMap()
			);
			dimension.spawnParticle(
				effectName,
				{
					x,
					y,
					z: maxZ,
				},
				new MolangVariableMap()
			);
		};
	};
	
	for (let x = minX; x <= maxX; x++) {
		for (let z = minZ; z <= maxZ; z++) {
			dimension.spawnParticle(
				effectName,
				{
					x,
					y: minY,
					z,
				},
				new MolangVariableMap()
			);
			dimension.spawnParticle(
				effectName,
				{
					x,
					y: maxY,
					z,
				},
				new MolangVariableMap()
			);
		};
	};

	for (let y = minY; y <= maxY; y++) {
		for (let z = minZ; z <= maxZ; z++) {
			dimension.spawnParticle(
				effectName,
				{
					x: minX,
					y,
					z,
				},
				new MolangVariableMap()
			);
			dimension.spawnParticle(
				effectName,
				{
					x: maxX,
					y,
					z,
				},
				new MolangVariableMap()
			);
		};
	};
};

Player.prototype.getItemCount = function( itemId ) {
	if (!itemId) return 0;
	
	const inventory = this.getComponent( "minecraft:inventory" ).container;
	let itemCount = 0;
	for (let i = 0; i < inventory.size; i++) {
		const item = inventory.getItem(i);
		if (item?.typeId == itemId) itemCount += item.amount;
	};
	
	return itemCount;
};