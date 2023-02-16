import { expect, assert } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ethers } from "hardhat"
import { NFTCollection } from "../typechain-types"
import { Factory } from "../typechain-types"

describe("Factory", function () {
    let factory: Factory
    let owner: SignerWithAddress
    let newContract: NFTCollection

    beforeEach(async () => {
        const Factory = await ethers.getContractFactory("Factory")
        factory = (await Factory.deploy()) as Factory
        await factory.deployed()

        const signers = await ethers.getSigners()
        owner = signers[0]
    })

    it("deploys a new NFTCollection contract", async () => {
        const name = "MyNFT"
        const symbol = "MNFT"
        await factory.connect(owner).deployCollection(name, symbol)
        const newContractAddress = await factory.collections(0)

        const NFTCollection = await ethers.getContractFactory("NFTCollection")
        const newContract = NFTCollection.attach(newContractAddress)
        const returnedName = await newContract.name()
        const returnedSymbol = await newContract.symbol()

        expect(returnedName).to.equal(name)
        expect(returnedSymbol).to.equal(symbol)
    })

    it("emits CollectionCreated event", async () => {
        const name = "MyNFT"
        const symbol = "MNFT"

        await new Promise<void>(async (resolve, reject) => {
            factory.once("CollectionCreated", async (_contractAddress, _name, _symbol) => {
                try {
                    assert.equal(_contractAddress, newContract.address)
                    assert.equal(_name, name)
                    assert.equal(_symbol, symbol)
                    resolve()
                } catch (e) {
                    reject(e)
                }
            })

            await factory.connect(owner).deployCollection(name, symbol)
            const newContractAddress = await factory.collections(0)
            const NFTCollection = await ethers.getContractFactory("NFTCollection")
            newContract = NFTCollection.attach(newContractAddress) as NFTCollection
        })
    })
})
