import { world, system, MolangVariableMap, MinecraftBlockTypes, Player } from "@minecraft/server";
import { ActionFormData } from "./Forms/Forms.js";
import { Button } from "./Forms/Components.js";
system.runInterval(
    () => {
        for (const player of world.getAllPlayers()) {
            const block = player.getBlockFromViewDirection({ maxDistance: 10 });
            if (block?.typeId == "test:structure_builder_n") {
                const blocks = getBlocks(
                    {
                        x: block.location.x - 2,
                        y: block.location.y - 1,
                        z: block.location.z + 4,
                    },
                    {
                        x: block.location.x + 2,
                        y: block.location.y + 4,
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
                } else spawnEdgeParticles(
                    {
                        x: block.location.x - 2,
                        y: block.location.y - 1,
                        z: block.location.z + 5,
                    },
                    {
                        x: block.location.x + 3,
                        y: block.location.y + 5,
                        z: block.location.z + 1,
                    },
                    block.dimension,
                    "test:white",
                );
            } else if (block?.typeId == "test:structure_builder_s") {
                const blocks = getBlocks(
                    {
                        x: block.location.x - 2,
                        y: block.location.y - 1,
                        z: block.location.z - 4,
                    },
                    {
                        x: block.location.x + 2,
                        y: block.location.y + 4,
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
                } else spawnEdgeParticles(
                    {
                        x: block.location.x - 2,
                        y: block.location.y - 1,
                        z: block.location.z - 4,
                    },
                    {
                        x: block.location.x + 3,
                        y: block.location.y + 5,
                        z: block.location.z,
                    },
                    block.dimension,
                    "test:white",
                );
            } else if (block?.typeId == "test:structure_builder_r") {
                const blocks = getBlocks(
                    {
                        x: block.location.x - 4,
                        y: block.location.y - 1,
                        z: block.location.z + 2,
                    },
                    {
                        x: block.location.x - 1,
                        y: block.location.y + 4,
                        z: block.location.z - 2,
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
                } else spawnEdgeParticles(
                    {
                        x: block.location.x - 4,
                        y: block.location.y - 1,
                        z: block.location.z + 3,
                    },
                    {
                        x: block.location.x,
                        y: block.location.y + 5,
                        z: block.location.z - 2,
                    },
                    block.dimension,
                    "test:white",
                );
            } else if (block?.typeId == "test:structure_builder_l") {
                const blocks = getBlocks(
                    {
                        x: block.location.x + 4,
                        y: block.location.y - 1,
                        z: block.location.z + 2,
                    },
                    {
                        x: block.location.x + 1,
                        y: block.location.y + 4,
                        z: block.location.z - 2,
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
                } else spawnEdgeParticles(
                    {
                        x: block.location.x + 5,
                        y: block.location.y - 1,
                        z: block.location.z + 3,
                    },
                    {
                        x: block.location.x + 1,
                        y: block.location.y + 5,
                        z: block.location.z - 2,
                    },
                    block.dimension,
                    "test:white",
                );
            };
        };
    },
	5,
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
            case "test:structure_builder_n": {
				 const blocks = getBlocks(
                    {
                        x: block.location.x - 2,
                        y: block.location.y - 1,
                        z: block.location.z + 4,
                    },
                    {
                        x: block.location.x + 2,
                        y: block.location.y + 4,
                        z: block.location.z + 1,
                    },
                    block.dimension,
                );
                
                if (blocks.length > 0) return player.sendMessage("Blocks in the direction!");
                build(player, block, false, false, true, false);
				break;
			};
			case "test:structure_builder_s": {
				const blocks = getBlocks(
                    {
                        x: block.location.x - 2,
                        y: block.location.y - 1,
                        z: block.location.z - 4,
                    },
                    {
                        x: block.location.x + 2,
                        y: block.location.y + 4,
                        z: block.location.z - 1,
                    },
                    block.dimension,
                );
                
                if (blocks.length > 0) return player.sendMessage("Blocks in the direction!");
                build(player, block, false, false, false, true);
				break;
			};
            case "test:structure_builder_r": {
				const blocks = getBlocks(
                    {
                        x: block.location.x - 4,
                        y: block.location.y - 1,
                        z: block.location.z + 2,
                    },
                    {
                        x: block.location.x - 1,
                        y: block.location.y + 4,
                        z: block.location.z - 2,
                    },
                    block.dimension,
                );
                
                if (blocks.length > 0) return player.sendMessage("Blocks in the direction!");
                build(player, block, false, true, false, false);
				break;
			};
            case "test:structure_builder_l": {
				const blocks = getBlocks(
                    {
                        x: block.location.x + 4,
                        y: block.location.y - 1,
                        z: block.location.z + 2,
                    },
                    {
                        x: block.location.x + 1,
                        y: block.location.y + 4,
                        z: block.location.z - 2,
                    },
                    block.dimension,
                );
                
                if (blocks.length > 0) return player.sendMessage("Blocks in the direction!");
                build(player, block, true, false, false, false);
				break;
			};
        };
    },
);

const build = ( player, block, l, r, n, s ) => {
	if (player.hasTag("inUI")) return;
	
	player.addTag("inUI");
    new ActionFormData({ title: "Choose a Structure" })
    .addButtons([
        new Button({
            id: "platform",
            text: "Platform\n x8 +  x16",
        }),
		new Button({
            id: "stairs",
            text: "Stairs\n x16 +  x32",
        }),
    ])
    .open(player)
    .then(
        (response) => {
			player.removeTag("inUI");
            if(response.canceled) return;
            switch(response.selection.customId) {
                case "platform":
					if (
						player.getItemCount( "minecraft:log" ) < 8
						|| player.getItemCount( "minecraft:stick" ) < 16
					) return player.sendMessage( "§cNot enough items!§r" );
					
					block.setType(MinecraftBlockTypes.air);
					
					player.runCommandAsync( "clear @s log 0 8" );
					player.runCommandAsync( "clear @s stick 0 16" );
					
                    if (l) {
                        player.runCommandAsync(
                            "structure load platform_l "
                            + block.location.x + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 2)
							+ " 0_degrees none block_by_block 5"
                        );
                    } else if (r) {
                        player.runCommandAsync(
                            "structure load platform_r "
                            + (block.location.x - 4) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 2)
							+ " 0_degrees none block_by_block 5"
                        );
                    } else if (n) {
                        player.runCommandAsync(
                            "structure load platform_n "
                            + (block.location.x - 2) + " "
                            + (block.location.y - 1) + " "
                            + block.location.z
							+ " 0_degrees none block_by_block 5"
                        );
                    } else if (s) {
                        player.runCommandAsync(
                            "structure load platform_s "
                            + (block.location.x - 2) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 4)
							+ " 0_degrees none block_by_block 5"
                        );
                    };
                break;
				case "stairs":
					if (
						player.getItemCount( "minecraft:log" ) < 8
						|| player.getItemCount( "minecraft:stick" ) < 16
					) return player.sendMessage( "§cNot enough items!§r" );
					
					block.setType(MinecraftBlockTypes.air);
					
					player.runCommandAsync( "clear @s log 0 16" );
					player.runCommandAsync( "clear @s stick 0 32" );
					
                    if (l) {
                        player.runCommandAsync(
                            "structure load stairs_l "
                            + block.location.x + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 2)
							+ " 0_degrees none block_by_block 5"
                        );
                    } else if (r) {
                        player.runCommandAsync(
                            "structure load stairs_r "
                            + (block.location.x - 4) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 2)
							+ " 0_degrees none block_by_block 5"
                        );
                    } else if (n) {
                        player.runCommandAsync(
                            "structure load stairs_n "
                            + (block.location.x - 2) + " "
                            + (block.location.y - 1) + " "
                            + block.location.z
							+ " 0_degrees none block_by_block 5"
                        );
                    } else if (s) {
                        player.runCommandAsync(
                            "structure load stairs_s "
                            + (block.location.x - 2) + " "
                            + (block.location.y - 1) + " "
                            + (block.location.z - 4)
							+ " 0_degrees none block_by_block 5"
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