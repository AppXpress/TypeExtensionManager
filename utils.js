import CONSTANTS from './constants'
import path from 'path'
import Cryptr from 'cryptr'

const cryptr = new Cryptr('gtnexusisBest@123')

const {
  createFile,
  readFile,
  writeToFile,
  isFileExisting
} = require('./utility/fileUtility')
const {
  getCustomerName,
  getDocumentType,
  getRulesetType,
  setupCustomerDirectories,
  setupCustomerFiles,
  jirafy,
  setupCutomerBaseCode,
  setupCustomerAxusCode,
  setupSampleData,
  setupCustomerResources,
} = require('./utility/customerUtility')

let {
  GENERAL: {
    ENCODING_UTF8,
    BASE_64,
    BASIC
  },
  configFile,
  writeOut,
  fields: {
    EXISTING,
    PRESENT_WORKING_DIR,
    CUSTOMER_DIRECTORY,
    CUSTOMER_TEST_DIRECTORY,
    CUSTOMER,
    TEST,
    FILE,
    USER_NAME,
    PASSWORD,
    DATA_KEY,
    USER,
    AUTHORIZATION
  },
  rl,
  essentials
} = CONSTANTS

/**
 * Initialize's module with config file
 */
let initModules = () => {
  return new Promise((resolve, reject) => {
    isFileExisting(`.`, `${configFile}`, `ini`).then((isExisting) => {
      readFile(`.`, `${configFile}`, `ini`).then((data) => {
        essentials = JSON.parse(data)
        essentials[EXISTING] = isExisting
        resolve(essentials)
      })
    }).catch((nonExistent) => {
      createFile(`.`, `${configFile}`, `.ini`).then(() => {
          essentials[EXISTING] = nonExistent
          resolve(essentials)
        })
        .catch((err) => {
          console.log(err)
          reject()
        })
    })
  })
}

let getPlatformLocation = () => {
  return new Promise((resolve, reject) => {
    essentials[PRESENT_WORKING_DIR] = __dirname
    let platformPath = essentials[PRESENT_WORKING_DIR].split(path.sep)
    let customerDirectoryPath = ''
    let customerTestDirectoryPath = ''

    if(process.platform === 'win32'){
        customerDirectoryPath = `${path.join(platformPath[0],platformPath[1],platformPath[2],platformPath[3],CUSTOMER)}`
        customerTestDirectoryPath = `${path.join(platformPath[0],platformPath[1],platformPath[2],platformPath[3], TEST,CUSTOMER)}`
    }else{
        customerDirectoryPath = `/${path.join(platformPath[0],platformPath[1],platformPath[2],platformPath[3],CUSTOMER)}`
        customerTestDirectoryPath = `/${path.join(platformPath[0],platformPath[1],platformPath[2],platformPath[3], TEST,CUSTOMER)}`
    }
    essentials[CUSTOMER_DIRECTORY] = `${customerDirectoryPath}`
    essentials[CUSTOMER_TEST_DIRECTORY] = `${customerTestDirectoryPath}`
    if (!essentials[EXISTING]) {
      let file = {}
      file[PRESENT_WORKING_DIR] = essentials[PRESENT_WORKING_DIR]
      file[CUSTOMER_DIRECTORY] = essentials[CUSTOMER_DIRECTORY]
      file[CUSTOMER_TEST_DIRECTORY] = essentials[CUSTOMER_TEST_DIRECTORY]
      writeOut[FILE] = file
    }
    resolve()
  })
}

let getUserCredentials = () => {
  return new Promise((resolve, reject) => {
    rl.question(`Enter your SUPORTQ Credentials(Need this to fetch data and create sample files for your module)\nUserName:\n`, (username) => {
      if (username) {
        essentials[USER] = {}
        console.log(`Password:`)
        rl.stdoutMuted = true;
        rl.question(``, (password) => {
          rl.stdoutMuted = false;
          essentials[USER][USER_NAME] = username
          essentials[USER][PASSWORD] = cryptr.encrypt(password)
          console.log("Data Key:")
          rl.question(``, (dataKey) => {
            if (dataKey) {
              essentials[USER][DATA_KEY] = dataKey
              writeOut[USER] = essentials[USER]
              resolve()
            } else {
              reject()
            }
          })
        })
      } else {
        reject(`NO USERNAME PROVIDED.`)
      }
    })
  })
}

let getUserPlatform = () => {
    return new Promise((resolve, reject) => {
        if(process.platform === 'win32'){
            essentials[IS_WIN] = true
        }else{
            essentials[IS_WIN] = false
        }
    })
}

let getBasicKey = (essentials) => {
  console.log(essentials)
  return new Promise((resolve, reject) => {
    if (essentials[USER][USER_NAME] && essentials[USER][PASSWORD]) {
      let username = essentials[USER][USER_NAME]
      let password = cryptr.decrypt(essentials[USER][PASSWORD])
      let buffer = new Buffer(`${username}:${password}`)
      if (buffer) {
        essentials[USER][AUTHORIZATION] = `${BASIC} ${buffer.toString(BASE_64)}`
        resolve()
      } else {
        reject()
      }
    }
  })
}

let writeUserData = async () => {
  await getPlatformLocation()
  await getUserCredentials()
  await writeToFile(`.`, `${configFile}`, `.ini`, writeOut)
}
/**
 * Process Customer - Gets all data required to setup TypeExtension and Axus
 * @param {*} essentials 
 */
let processCustomer = (essentials) => {
  return new Promise(async (resolve, reject) => {
    await getCustomerName(essentials)
    await getDocumentType(essentials)
    await getRulesetType(essentials)
    await setupCustomerDirectories(essentials)
    await setupCustomerFiles(essentials)
    await jirafy(essentials)
    await setupSampleData(essentials)
    await setupCutomerBaseCode(essentials)
    await setupCustomerAxusCode(essentials)
    await setupCustomerResources(essentials)
    resolve()
  })
}


export default {
  initModules,
  writeUserData,
  getBasicKey,
  processCustomer
}