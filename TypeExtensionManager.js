/**
 * Type Extension Manager
 * Developer(s): Bhuvanesh(bhuvanesh.arasu@infor.com)	
 */

// import readline from 'readline';
// import jake from 'jake';
// import fs from 'fs';
// import path from 'path';
// import needle from 'needle';
// import moment from 'moment'
import utils from './utils'
import CONSTANTS from './constants'

let {essentials} = CONSTANTS
let {initModules, writeUserData} = utils

const main = async () => {
  await initModules()
  if(!essentials.existing){
    await writeUserData()
    console.log(essentials)
  }
}

main()
