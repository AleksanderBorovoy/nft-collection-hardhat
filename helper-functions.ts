import { run } from "hardhat"

export const verify = async (contractAddress: string) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
        })
    } catch (e: any) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already verified!")
        } else {
            console.log(e)
        }
    }
}
