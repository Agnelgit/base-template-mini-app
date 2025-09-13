import { expect } from "chai";
import { ethers } from "hardhat";
import { MoneySaver } from "../typechain-types";

describe("MoneySaver", function () {
  let moneySaver: MoneySaver;
  let owner: any;
  let user1: any;
  let user2: any;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    
    const MoneySaver = await ethers.getContractFactory("MoneySaver");
    moneySaver = await MoneySaver.deploy();
    await moneySaver.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await moneySaver.owner()).to.equal(owner.address);
    });

    it("Should have zero initial balance", async function () {
      expect(await moneySaver.getBalance()).to.equal(0);
    });
  });

  describe("Deposits", function () {
    it("Should allow users to deposit ETH", async function () {
      const depositAmount = ethers.parseEther("1.0");
      
      await expect(moneySaver.connect(user1).deposit({ value: depositAmount }))
        .to.emit(moneySaver, "Deposit")
        .withArgs(user1.address, depositAmount);

      expect(await moneySaver.getBalance()).to.equal(depositAmount);
      expect(await moneySaver.getUserBalance(user1.address)).to.equal(depositAmount);
    });

    it("Should reject zero amount deposits", async function () {
      await expect(moneySaver.connect(user1).deposit({ value: 0 }))
        .to.be.revertedWith("Deposit amount must be greater than 0");
    });

    it("Should track multiple deposits from same user", async function () {
      const deposit1 = ethers.parseEther("1.0");
      const deposit2 = ethers.parseEther("0.5");
      
      await moneySaver.connect(user1).deposit({ value: deposit1 });
      await moneySaver.connect(user1).deposit({ value: deposit2 });
      
      expect(await moneySaver.getUserBalance(user1.address)).to.equal(deposit1 + deposit2);
      expect(await moneySaver.getBalance()).to.equal(deposit1 + deposit2);
    });
  });

  describe("Withdrawals", function () {
    beforeEach(async function () {
      // Deposit some ETH first
      await moneySaver.connect(user1).deposit({ value: ethers.parseEther("2.0") });
      await moneySaver.connect(user2).deposit({ value: ethers.parseEther("1.0") });
    });

    it("Should allow owner to withdraw all funds", async function () {
      const initialBalance = await owner.provider.getBalance(owner.address);
      const contractBalance = await moneySaver.getBalance();
      
      const tx = await moneySaver.withdraw();
      const receipt = await tx.wait();
      const gasUsed = receipt?.gasUsed * receipt?.gasPrice;
      
      const finalBalance = await owner.provider.getBalance(owner.address);
      const expectedBalance = initialBalance + contractBalance - gasUsed;
      
      expect(finalBalance).to.be.closeTo(expectedBalance, ethers.parseEther("0.01"));
      expect(await moneySaver.getBalance()).to.equal(0);
    });

    it("Should not allow non-owner to withdraw", async function () {
      await expect(moneySaver.connect(user1).withdraw())
        .to.be.revertedWith("Only the owner can call this function");
    });

    it("Should emit Withdrawal event", async function () {
      const contractBalance = await moneySaver.getBalance();
      
      await expect(moneySaver.withdraw())
        .to.emit(moneySaver, "Withdrawal")
        .withArgs(owner.address, contractBalance);
    });
  });

  describe("Ownership", function () {
    it("Should allow owner to transfer ownership", async function () {
      await expect(moneySaver.transferOwnership(user1.address))
        .to.emit(moneySaver, "OwnershipTransferred")
        .withArgs(owner.address, user1.address);
      
      expect(await moneySaver.owner()).to.equal(user1.address);
    });

    it("Should not allow non-owner to transfer ownership", async function () {
      await expect(moneySaver.connect(user1).transferOwnership(user2.address))
        .to.be.revertedWith("Only the owner can call this function");
    });

    it("Should not allow transferring to zero address", async function () {
      await expect(moneySaver.transferOwnership(ethers.ZeroAddress))
        .to.be.revertedWith("New owner cannot be the zero address");
    });
  });

  describe("Contract Info", function () {
    it("Should return correct contract information", async function () {
      await moneySaver.connect(user1).deposit({ value: ethers.parseEther("1.0") });
      
      const [contractOwner, contractBalance, totalDeposits] = await moneySaver.getContractInfo();
      
      expect(contractOwner).to.equal(owner.address);
      expect(contractBalance).to.equal(ethers.parseEther("1.0"));
      expect(totalDeposits).to.equal(ethers.parseEther("1.0"));
    });
  });
});
