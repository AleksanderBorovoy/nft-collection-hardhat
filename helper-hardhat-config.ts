import { BigNumber } from "ethers"

type NetworkConfigItem = {
    name: string
    fundAmount?: BigNumber
    fee?: string
    keyHash?: string
    interval?: string
    linkToken?: string
    vrfCoordinator?: string
    keepersUpdateInterval?: string
    oracle?: string
    jobId?: string
    ethUsdPriceFeed?: string
}

type NetworkConfigMap = {
    [chainId: string]: NetworkConfigItem
}

export const networkConfig: NetworkConfigMap = {
    5: {
        name: "goerly",
    },
}

export const developmentChains = ["hardhat", "localhost"]
