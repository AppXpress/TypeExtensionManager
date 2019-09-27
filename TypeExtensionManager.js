/**
 * Type Extension Manager
 * Developer(s): Bhuvanesh(bhuvanesh.arasu@infor.com)	
 */

import utils from './utils'
import CONSTANTS from './constants'

let {initModules, writeUserData, getBasicKey, processCustomer} = utils

const main = async () => {
  await initModules().then(async (essentials) => {
    console.log(essentials)
    if(!essentials.existing){
        await writeUserData()
        console.log(`Since this is the first time using the tool kindly restart the tool.`)
        process.exit(0)
    }
    await getBasicKey(essentials)
    await processCustomer(essentials)
    console.log(essentials)
    process.exit()
  })
}

main()
