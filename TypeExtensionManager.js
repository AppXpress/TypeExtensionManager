/**
 * Type Extension Manager
 * Developer(s): Bhuvanesh(bhuvanesh.arasu@infor.com)	
 */

import utils from './utils'
import CONSTANTS from './constants'
import { runConfig } from './utility/customerUtility';

let {initModules, writeUserData, getBasicKey, processCustomer} = utils
let {CMD_ARGUMENTS:{ARG_1, ARG_2}, STARTUP_LOG} = CONSTANTS

const main = async () => {
  await initModules().then(async (essentials) => {
    let configType = ``
    let rulesetType = ``
    if(!essentials.existing){
        await writeUserData()
        console.log(`Since this is the first time using the tool kindly restart the tool.`)
        process.exit(0)
    }
    await getBasicKey(essentials)
    if(process.argv.indexOf(ARG_1) != -1 && process.argv.indexOf(ARG_2) != -1){
      let indexOfConfigType = process.argv.indexOf(ARG_1) + 1
      let indexOfType = process.argv.indexOf(ARG_2) + 1
      rulesetType = process.argv[indexOfType]
      configType = process.argv[indexOfConfigType]
      runConfig(essentials, configType, rulesetType)
    }
    await processCustomer(essentials)
    process.exit()
  })
}
console.log(STARTUP_LOG.STARTUP_SCREEN)
main()
