/**
 * Type Extension Manager
 * Developer(s): Bhuvanesh(bhuvanesh.arasu@infor.com)	
 */

import utils from './utils'
import CONSTANTS from './constants'
import { runConfig } from './utility/customerUtility';

let {initModules, writeUserData, getBasicKey, processCustomer, processPlatformModule} = utils
let {CMD_ARGUMENTS:{DOC_ARG, TYPE_ARG, HELP_ARG}, STARTUP_LOG, MESSAGES:{HELP:{HELP_TEXT}}} = CONSTANTS

const main = async () => {
  
  if(process.argv.indexOf(HELP_ARG) != -1){
    console.log(HELP_TEXT)
    process.exit(0)
  }

  await initModules().then(async (essentials) => {
    let configType = ``
    let rulesetType = ``
    if(!essentials.existing){
        await writeUserData()
        console.log(`Since this is the first time using the tool kindly restart the tool.`)
        process.exit(0)
    }
    await getBasicKey(essentials)
    if(process.argv.indexOf(DOC_ARG) != -1 && process.argv.indexOf(TYPE_ARG) != -1){
      let indexOfConfigType = process.argv.indexOf(DOC_ARG) + 1
      let indexOfType = process.argv.indexOf(TYPE_ARG) + 1
      rulesetType = process.argv[indexOfType]
      configType = process.argv[indexOfConfigType]
      runConfig(essentials, configType, rulesetType)
    }
    await processCustomer(essentials)
    await processPlatformModule(essentials)
    console.log(essentials)
    process.exit()
  })
}
console.log(STARTUP_LOG.STARTUP_SCREEN)
main()
