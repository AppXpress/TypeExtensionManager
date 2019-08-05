import CONSTANTS from './constants'
import path from 'path'
import Cryptr from 'cryptr'

const cryptr = new Cryptr('gtnexusisBest@123')

const {createFile, readFile, writeToFile, isFileExisting} = require('./utility/fileUtility')

let {
    GENERAL:{ENCODING_UTF8},
    configFile,
    writeOut,
    fields: {EXISTING, PRESENT_WORKING_DIR, CUSTOMER_DIRECTORY, CUSTOMER_TEST_DIRECTORY, CUSTOMER, TEST, FILE, CREDENTIALS
        ,USER_NAME, PASSWORD, DATA_KEY,USER
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
                resolve()
            })
        }).catch((nonExistent) => {
            createFile(`.`,`${configFile}`,`ini`).then(() => {
                essentials[EXISTING] = nonExistent
                resolve()
            })
            .catch((err) => {
                console.log(err)
            })
        })
    })
}

let getPlatformLocation = () => {
    return new Promise((resolve, reject) => {
        essentials[PRESENT_WORKING_DIR] = __dirname
        let platformPath = essentials[PRESENT_WORKING_DIR].split(path.sep)
        essentials[CUSTOMER_DIRECTORY] = `/${path.join(platformPath[0],platformPath[1],platformPath[2],platformPath[3],CUSTOMER)}`
        essentials[CUSTOMER_TEST_DIRECTORY] = `/${path.join(platformPath[0],platformPath[1],platformPath[2],platformPath[3], TEST,CUSTOMER)}`
        if(!essentials[EXISTING]){
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
        rl.question(`Enter your SUPORTQ Credentials(Need this to fetch data and create sample files for your module)\nUserName:\n`, (username) =>{
            if(username){
                essentials[CREDENTIALS] = {}
                console.log(`Password:`)
                rl.stdoutMuted = true;
                rl.question(``, (password) => {
                    rl.stdoutMuted = false;
                    essentials[CREDENTIALS][USER_NAME] = username
                    essentials[CREDENTIALS][PASSWORD] = cryptr.encrypt(password)
                    console.log("Data Key:")
                    rl.question(``, (dataKey) => {
                        if(dataKey){
                            essentials[CREDENTIALS][DATA_KEY] = dataKey
                            writeOut[USER] = essentials[CREDENTIALS]
                            resolve()
                        }else{
                            reject()
                        }
                    })
                })
            }else{
                reject(`NO USERNAME PROVIDED.`)
            }
        })
    })
}

let writeUserData = async () => {
    await getPlatformLocation()
    await getUserCredentials()
    await writeToFile(`.`, `${configFile}`, `ini`,writeOut)
}

export default {
    initModules,
    writeUserData    
}