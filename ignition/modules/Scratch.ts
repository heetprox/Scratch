import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ScratchModule = buildModule("ScratchModule", (m) => {
  const scratch = m.contract("Scratch");
  return { scratch };
});

export default ScratchModule;