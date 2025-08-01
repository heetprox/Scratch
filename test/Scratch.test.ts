import { expect } from "chai";
import { ethers } from "hardhat";
import { Scratch } from "../typechain-types";

describe("Scratch Contract", function () {
  let scratch: Scratch;
  let owner: any;
  let addr1: any;
  let addr2: any;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    const ScratchFactory = await ethers.getContractFactory("Scratch");
    scratch = await ScratchFactory.deploy() as Scratch;
    await scratch.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await scratch.owner()).to.equal(owner.address);
    });

    it("Should have zero platform fee initially", async function () {
      expect(await scratch.platformFee()).to.equal(0);
    });
  });

  describe("Payments", function () {
    it("Should allow sending payments with messages", async function () {
      const paymentAmount = ethers.parseEther("0.01");
      const message = "Test payment";

      // Send payment from addr1 to addr2
      const tx = await scratch.connect(addr1).sendPayment(addr2.address, message, {
        value: paymentAmount
      });
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      // Get the event from the receipt
      const event = receipt?.logs.find(
        (log) => log.fragment?.name === "PaymentSent"
      );
      
      // Verify event was emitted with correct parameters
      expect(event).to.not.be.undefined;
      const args = event?.args;
      expect(args?.[0]).to.equal(addr1.address); // sender
      expect(args?.[1]).to.equal(addr2.address); // recipient
      expect(args?.[2]).to.equal(paymentAmount); // amount
      expect(args?.[3]).to.equal(message); // message
    });

    it("Should reject payments with zero value", async function () {
      await expect(
        scratch.connect(addr1).sendPayment(addr2.address, "Test", { value: 0 })
      ).to.be.revertedWith("Payment must be greater than 0");
    });

    it("Should reject payments to zero address", async function () {
      await expect(
        scratch.connect(addr1).sendPayment(ethers.ZeroAddress, "Test", {
          value: ethers.parseEther("0.01")
        })
      ).to.be.revertedWith("Invalid recipient");
    });

    it("Should reject payments to self", async function () {
      await expect(
        scratch.connect(addr1).sendPayment(addr1.address, "Test", {
          value: ethers.parseEther("0.01")
        })
      ).to.be.revertedWith("Cannot pay yourself");
    });
  });

  describe("Fee Management", function () {
    it("Should allow owner to update fee", async function () {
      await scratch.connect(owner).updateFee(500); // 5%
      expect(await scratch.platformFee()).to.equal(500);
    });

    it("Should reject fee update from non-owner", async function () {
      await expect(
        scratch.connect(addr1).updateFee(500)
      ).to.be.revertedWith("Only owner");
    });

    it("Should reject fee higher than 10%", async function () {
      await expect(
        scratch.connect(owner).updateFee(1001)
      ).to.be.revertedWith("Max 10% fee");
    });

    it("Should apply fee correctly to payments", async function () {
      // Set fee to 5%
      await scratch.connect(owner).updateFee(500);
      
      const paymentAmount = ethers.parseEther("1");
      const fee = (paymentAmount * BigInt(500)) / BigInt(10000);
      const netAmount = paymentAmount - fee;
      
      // Check balances before payment
      const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
      const addr2BalanceBefore = await ethers.provider.getBalance(addr2.address);
      
      // Send payment
      await scratch.connect(addr1).sendPayment(addr2.address, "Test with fee", {
        value: paymentAmount
      });
      
      // Check balances after payment
      const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
      const addr2BalanceAfter = await ethers.provider.getBalance(addr2.address);
      
      // Verify recipient received correct amount
      expect(addr2BalanceAfter - addr2BalanceBefore).to.equal(netAmount);
      
      // Verify owner received fee
      expect(ownerBalanceAfter - ownerBalanceBefore).to.equal(fee);
    });
  });

  describe("Owner Management", function () {
    it("Should allow owner to transfer ownership", async function () {
      await scratch.connect(owner).updateOwner(addr1.address);
      expect(await scratch.owner()).to.equal(addr1.address);
    });

    it("Should reject ownership transfer from non-owner", async function () {
      await expect(
        scratch.connect(addr1).updateOwner(addr2.address)
      ).to.be.revertedWith("Only owner");
    });
  });

  describe("Utility Functions", function () {
    it("Should return correct chain ID", async function () {
      const chainId = await scratch.getChainId();
      expect(chainId).to.not.equal(0);
    });

    it("Should return correct contract balance", async function () {
      // Initially zero
      expect(await scratch.getContractBalance()).to.equal(0);
      
      // Get contract address
      const contractAddress = await scratch.getAddress();
      
      // Send ETH directly to contract (will be rejected but we can test the function)
      try {
        await owner.sendTransaction({
          to: contractAddress,
          value: ethers.parseEther("0.1")
        });
      } catch (e) {
        // Expected to fail with "Use sendPayment function"
      }
      
      // Should still be zero as direct transfers are rejected
      expect(await scratch.getContractBalance()).to.equal(0);
    });
  });
});