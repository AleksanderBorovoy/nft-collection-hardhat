import { expect, assert } from "chai"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { ethers } from "hardhat"
import { NFTCollection } from "../typechain-types"

describe("NFTCollection", () => {
    let nftCollection: NFTCollection
    let owner: SignerWithAddress
    let user: SignerWithAddress
    const tokenURI = "https://example.com/mytokenuri"

    beforeEach(async () => {
        const NFTCollection = await ethers.getContractFactory("NFTCollection")
        nftCollection = (await NFTCollection.deploy("MyNFT", "MNFT")) as NFTCollection
        await nftCollection.deployed()
        const signers = await ethers.getSigners()
        owner = signers[0]
        user = signers[1]
    })

    it("have a name", async () => {
        expect(await nftCollection.name()).to.equal("MyNFT")
    })

    it("have a symbol", async () => {
        expect(await nftCollection.symbol()).to.equal("MNFT")
    })

    it("returns the correct token URI", async function () {
        await nftCollection.connect(owner).mint(user.address, tokenURI)
        const tokenId = 0

        const returnedURI = await nftCollection.tokenURI(tokenId)
        expect(returnedURI).to.equal(tokenURI)
    })

    it("emits TokenMinted event", async () => {
        await new Promise<void>(async (resolve, reject) => {
            nftCollection.once(
                "TokenMinted",
                async (_contractAddress, _recipient, _tokenId, _tokenUri) => {
                    try {
                        assert.equal(_contractAddress, nftCollection.address)
                        assert.equal(_recipient, user.address)
                        assert.equal(_tokenId.toString(), "0")
                        assert.equal(_tokenUri, tokenURI)
                        resolve()
                    } catch (e) {
                        reject(e)
                    }
                }
            )

            await nftCollection.connect(owner).mint(user.address, tokenURI)
        })
    })
})
