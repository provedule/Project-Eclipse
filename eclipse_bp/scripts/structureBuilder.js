import { world, system, MolangVariableMap, MinecraftBlockTypes, Player } from "@minecraft/server";
import { ActionFormData } from "./Forms/Forms.js";
import { Button } from "./Forms/Components.js";
system.events.beforeWatchdogTerminate.subscribe(
	(data) => data.cancel = true,
);

const allowedBlocks = [
	"lunar:structure_builder",
];

world.events.beforeItemUse.subscribe(
    (data) => {
		const { source: player, item } = data;
		const rotationY = player.getRotation().y.toFixed(0);
		
		const block = {
			location: {
				x: player.location.x,
				y: player.location.y,
				z: player.location.z,
			},
			dimension: player.dimension,
			setType: () => null,
		};
		
		if (item?.typeId == "lunar:steel_hammer") {
			if (
				rotationY <= 45
				&& rotationY >= -45
			) hammerBuild(player, block, false, false, true, false);
			else if (
				rotationY <= -45
				&& rotationY >= -135
			) hammerBuild(player, block, true, false, false, false);
			else if (
				rotationY <= -135
				|| rotationY >= 135
			) hammerBuild(player, block, false, false, false, true);
			else if (
				rotationY <= 135
				&& rotationY >= 45
			) hammerBuild(player, block, false, true, false, false);
		};
    },
);

world.events.beforeItemUseOn.subscribe(
    (data) => {
		const { source: player, item } = data;
		const block = player.getBlockFromViewDirection();
		if(player.isSneaking) return;
		if(allowedBlocks.includes(block?.typeId)) data.cancel = true;
		
		const rotationY = player.getRotation().y.toFixed(0);
		if (block?.typeId == "lunar:structure_builder") {
			if (
				rotationY <= 45
				&& rotationY >= -45
			) build(player, block, false, false, true, false);
			else if (
				rotationY <= -45
				&& rotationY >= -135
			) build(player, block, true, false, false, false);
			else if (
				rotationY <= -135
				|| rotationY >= 135
			) build(player, block, false, false, false, true);
			else if (
				rotationY <= 135
				&& rotationY >= 45
			) build(player, block, false, true, false, false);
		};
    },
);

system.runInterval(
    () => {
        for (const player of world.getAllPlayers()) {
			const block = player.getBlockFromViewDirection();
			const rotationY = player.getRotation().y.toFixed(0);
			if (block?.typeId == "lunar:structure_builder") {
				if (
					rotationY <= 45
					&& rotationY >= -45
				) spawnEdgeParticles(
					{
						x: block.location.x,
						y: block.location.y,
						z: block.location.z + 1,
					},
					{
						x: block.location.x + 1,
						y: block.location.y + 1,
						z: block.location.z + 2,
					},
					block.dimension,
					"test:white",
				);
				else if (
					rotationY <= -45
					&& rotationY >= -135
				) spawnEdgeParticles(
					{
						x: block.location.x + 1,
						y: block.location.y,
						z: block.location.z,
					},
					{
						x: block.location.x + 2,
						y: block.location.y + 1,
						z: block.location.z + 1,
					},
					block.dimension,
					"test:white",
				);
				else if (
					rotationY <= -135
					|| rotationY >= 135
				) spawnEdgeParticles(
					{
						x: block.location.x,
						y: block.location.y,
						z: block.location.z,
					},
					{
						x: block.location.x + 1,
						y: block.location.y + 1,
						z: block.location.z - 1,
					},
					block.dimension,
					"test:white",
				);
				else if (
					rotationY <= 135
					&& rotationY >= 45
				) spawnEdgeParticles(
					{
						x: block.location.x,
						y: block.location.y,
						z: block.location.z,
					},
					{
						x: block.location.x - 1,
						y: block.location.y + 1,
						z: block.location.z + 1,
					},
					block.dimension,
					"test:white",
				);
			};
		};
    },
);

// - Gold Insulation
// - Steel Sheet Block
// - Steel Block
// - Laser
// - CPU
// - Silicon Crystal
// - Metasteel

const build = ( player, block, l, r, n, s ) => {
	if (player.hasTag("inUI")) return;
	
	player.addTag("inUI");
    new ActionFormData({ title: "Choose a Structure" })
    .addButtons(
		[
			new Button(
				{
					id: "4way",
					text: "4 Way\n x12  x6  x16",
				}
			),
			/*new Button(
				{
					id: "chamber",
					text: "Chamber\n x5 +  x23 +  x55",
				}
			),*/
			new Button(
				{
					id: "antechamber",
					text: "Antechamber\n x128  x64  x64  x1  x1",
				}
			),
			new Button(
				{
					id: "craftingroom",
					text: "Crafting Room\n x32  x32  x32  x1",
				}
			),
			new Button(
				{
					id: "hallway",
					text: "Hallway\n x12  x6  x16",
				}
			),
			new Button(
				{
					id: "turn_l",
					text: "Turn Left\n x12  x6  x16",
				}
			),
			new Button(
				{
					id: "turn_r",
					text: "Turn Right\n x12  x6  x16",
				}
			),
			new Button(
				{
					id: "waterroom",
					text: "Water Room\n x64  x64  x32",
				}
			),
		],
	)
    .open(player)
    .then(
        (response) => {
			player.removeTag("inUI");
            if(response.canceled) return;
			
            switch(response.selection.customId) {
				case "4way":
                    if (l) {
						const blocks = getBlocks(
							{
								x: block.location.x + 17,
								y: block.location.y - 1,
								z: block.location.z - 8,
							},
							{
								x: block.location.x + 1,
								y: block.location.y + 11,
								z: block.location.z + 8,
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
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
								z: block.location.z - 8,
							},
							{
								x: block.location.x - 1,
								y: block.location.y + 11,
								z: block.location.z + 8,
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
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
								x: block.location.x - 8,
								y: block.location.y - 1,
								z: block.location.z + 17,
							},
							{
								x: block.location.x + 8,
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
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
								x: block.location.x - 8,
								y: block.location.y - 1,
								z: block.location.z - 17,
							},
							{
								x: block.location.x + 8,
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
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
				/*case "chamber":
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
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
						if (
				player.getItemCount( "lunar:gold_insulation" ) < 5
				|| player.getItemCount( "lunar:scrap_metal" ) < 23
				|| player.getItemCount( "lunar:steel_sheet" ) < 55
			) return player.sendMessage( "§cNot enough items!§r" );
					
			player.runCommandAsync( "clear @s lunar:gold_insulation 0 5" );
			player.runCommandAsync( "clear @s lunar:scrap_metal 0 23" );
			player.runCommandAsync( "clear @s lunar:steel_sheet 0 55" );
						
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
						if (
				player.getItemCount( "lunar:gold_insulation" ) < 5
				|| player.getItemCount( "lunar:scrap_metal" ) < 23
				|| player.getItemCount( "lunar:steel_sheet" ) < 55
			) return player.sendMessage( "§cNot enough items!§r" );
					
			player.runCommandAsync( "clear @s lunar:gold_insulation 0 5" );
			player.runCommandAsync( "clear @s lunar:scrap_metal 0 23" );
			player.runCommandAsync( "clear @s lunar:steel_sheet 0 55" );
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
						if (
				player.getItemCount( "lunar:gold_insulation" ) < 5
				|| player.getItemCount( "lunar:scrap_metal" ) < 23
				|| player.getItemCount( "lunar:steel_sheet" ) < 55
			) return player.sendMessage( "§cNot enough items!§r" );
					
			player.runCommandAsync( "clear @s lunar:gold_insulation 0 5" );
			player.runCommandAsync( "clear @s lunar:scrap_metal 0 23" );
			player.runCommandAsync( "clear @s lunar:steel_sheet 0 55" );
			
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_chamber "
                            + (block.location.x - 4) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 9)
							+ " 90_degrees none"
                        );
                    };
                break;*/
				case "antechamber":
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
						
						if (
							player.getItemCount( "lunar:laser" ) < 1
							|| player.getItemCount( "lunar:cpu" ) < 1
							|| player.getItemCount( "lunar:metasteel" ) < 64
							|| player.getItemCount( "lunar:steel_block" ) < 64
							|| player.getItemCount( "lunar:steel_sheet" ) < 128
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:laser 0 1" );
						player.runCommandAsync( "clear @s lunar:cpu 0 1" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 64" );
						player.runCommandAsync( "clear @s lunar:steel_block 0 64" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 128" );
						
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
						
						if (
							player.getItemCount( "lunar:laser" ) < 1
							|| player.getItemCount( "lunar:cpu" ) < 1
							|| player.getItemCount( "lunar:metasteel" ) < 64
							|| player.getItemCount( "lunar:steel_block" ) < 64
							|| player.getItemCount( "lunar:steel_sheet" ) < 128
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:laser 0 1" );
						player.runCommandAsync( "clear @s lunar:cpu 0 1" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 64" );
						player.runCommandAsync( "clear @s lunar:steel_block 0 64" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 128" );
						
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
						
						if (
							player.getItemCount( "lunar:laser" ) < 1
							|| player.getItemCount( "lunar:cpu" ) < 1
							|| player.getItemCount( "lunar:metasteel" ) < 64
							|| player.getItemCount( "lunar:steel_block" ) < 64
							|| player.getItemCount( "lunar:steel_sheet" ) < 128
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:laser 0 1" );
						player.runCommandAsync( "clear @s lunar:cpu 0 1" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 64" );
						player.runCommandAsync( "clear @s lunar:steel_block 0 64" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 128" );
						
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
						
						if (
							player.getItemCount( "lunar:laser" ) < 1
							|| player.getItemCount( "lunar:cpu" ) < 1
							|| player.getItemCount( "lunar:metasteel" ) < 64
							|| player.getItemCount( "lunar:steel_block" ) < 64
							|| player.getItemCount( "lunar:steel_sheet" ) < 128
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:laser 0 1" );
						player.runCommandAsync( "clear @s lunar:cpu 0 1" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 64" );
						player.runCommandAsync( "clear @s lunar:steel_block 0 64" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 128" );
						
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
				case "craftingroom":
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 32
							|| player.getItemCount( "lunar:cpu" ) < 1
							|| player.getItemCount( "lunar:metasteel" ) < 32
							|| player.getItemCount( "lunar:steel_sheet" ) < 32
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 32" );
						player.runCommandAsync( "clear @s lunar:cpu 0 1" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 32" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 32" );
						
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 32
							|| player.getItemCount( "lunar:cpu" ) < 1
							|| player.getItemCount( "lunar:metasteel" ) < 32
							|| player.getItemCount( "lunar:steel_sheet" ) < 32
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 32" );
						player.runCommandAsync( "clear @s lunar:cpu 0 1" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 32" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 32" );
						
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 32
							|| player.getItemCount( "lunar:cpu" ) < 1
							|| player.getItemCount( "lunar:metasteel" ) < 32
							|| player.getItemCount( "lunar:steel_sheet" ) < 32
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 32" );
						player.runCommandAsync( "clear @s lunar:cpu 0 1" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 32" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 32" );
						
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 32
							|| player.getItemCount( "lunar:cpu" ) < 1
							|| player.getItemCount( "lunar:metasteel" ) < 32
							|| player.getItemCount( "lunar:steel_sheet" ) < 32
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 32" );
						player.runCommandAsync( "clear @s lunar:cpu 0 1" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 32" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 32" );
						
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_hallway "
							+ (block.location.x + 1) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 3)
							+ " 270_degrees none"
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 6
							|| player.getItemCount( "lunar:metasteel" ) < 16
							|| player.getItemCount( "lunar:steel_sheet" ) < 12
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 6" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 16" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 12" );
						
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
				case "waterroom":
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 64
							|| player.getItemCount( "lunar:metasteel" ) < 32
							|| player.getItemCount( "lunar:steel_sheet" ) < 64
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 64" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 32" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 64" );
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_waterroom "
							+ (block.location.x + 1) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 14)
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 64
							|| player.getItemCount( "lunar:metasteel" ) < 32
							|| player.getItemCount( "lunar:steel_sheet" ) < 64
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 64" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 32" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 64" );
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_waterroom "
                            + (block.location.x - 25) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 14)
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 64
							|| player.getItemCount( "lunar:metasteel" ) < 32
							|| player.getItemCount( "lunar:steel_sheet" ) < 64
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 64" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 32" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 64" );
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_waterroom "
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
						
						if (
							player.getItemCount( "lunar:gold_insulation" ) < 64
							|| player.getItemCount( "lunar:metasteel" ) < 32
							|| player.getItemCount( "lunar:steel_sheet" ) < 64
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:gold_insulation 0 64" );
						player.runCommandAsync( "clear @s lunar:metasteel 0 32" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 64" );
						
						block.setType(MinecraftBlockTypes.air);
						player.runCommandAsync(
                            "structure load ecli_waterroom "
                            + (block.location.x - 14) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 25)
							+ " 90_degrees none"
                        );
                    };
                break;
			};
        },
    );
};

const hammerBuild = ( player, block, l, r, n, s ) => {
	if (player.hasTag("inUI")) return;
	
	player.addTag("inUI");
    new ActionFormData({ title: "Choose a Structure" })
    .addButtons(
		[
			new Button(
				{
					id: "battery",
					text: "Battery\n x6  x16  x1",
				}
			),
		],
	)
    .open(player)
    .then(
        (response) => {
			player.removeTag("inUI");
            if(response.canceled) return;
			
            switch(response.selection.customId) {
				case "battery":
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
						
						if (
							player.getItemCount( "lunar:silicon_crystal" ) < 16
							|| player.getItemCount( "lunar:cpu" ) < 1
							|| player.getItemCount( "lunar:steel_sheet" ) < 6
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:silicon_crystal 0 16" );
						player.runCommandAsync( "clear @s lunar:cpu 0 1" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 6" );
						
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
						
						if (
							player.getItemCount( "lunar:silicon_crystal" ) < 16
							|| player.getItemCount( "lunar:cpu" ) < 1
							|| player.getItemCount( "lunar:steel_sheet" ) < 6
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:silicon_crystal 0 16" );
						player.runCommandAsync( "clear @s lunar:cpu 0 1" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 6" );
						
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
						
						if (
							player.getItemCount( "lunar:silicon_crystal" ) < 16
							|| player.getItemCount( "lunar:cpu" ) < 1
							|| player.getItemCount( "lunar:steel_sheet" ) < 6
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:silicon_crystal 0 16" );
						player.runCommandAsync( "clear @s lunar:cpu 0 1" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 6" );
						
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
						
						if (
							player.getItemCount( "lunar:silicon_crystal" ) < 16
							|| player.getItemCount( "lunar:cpu" ) < 1
							|| player.getItemCount( "lunar:steel_sheet" ) < 6
						) return player.sendMessage( "§cNot enough items!§r" );
					
						player.runCommandAsync( "clear @s lunar:silicon_crystal 0 16" );
						player.runCommandAsync( "clear @s lunar:cpu 0 1" );
						player.runCommandAsync( "clear @s lunar:steel_sheet 0 6" );
						
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