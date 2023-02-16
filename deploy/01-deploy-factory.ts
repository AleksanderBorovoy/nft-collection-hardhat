import { DeployFunction } from "hardhat-deploy/types"
import { network } from "hardhat"
import { developmentChains } from "../helper-hardhat-config"
import { verify } from "../helper-functions"

const deployFunction: DeployFunction = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    console.log("deploy :", deploy)
    console.log("deployer: ", deployer)
    const factory = await deploy("Factory", {
        from: deployer,
        log: true,
        waitConfirmations: developmentChains.includes(network.name) ? 1 : 4,
    })

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(factory.address)
    }
}

export default deployFunction
deployFunction.tags = [`all`, `factory`]
