import {
    createFile,
    isFileExisting
} from '../fileUtility'
import CONSTANTS from '../../constants'

const {
    fields: {
        CUSTOMER,
        RULE_SET_TYPE,
        CUSTOMER_NAME,
        FILE,
        CUSTOMER_DIRECTORY,
        CUSTOMER_TEST_DIRECTORY,
        MODULE_NAME,
        MODULE_PATH,
        ADD_PLATFORM_FILE
    },
    FILES: {
        EXTENSIONS: {
            JS,
            SPEC
        }
    },
    MESSAGES: {
        INFO: {
            COULD_NOT_CREATE_AXUS_TEST_FILE,
            DATA_ALREADY_PRESENT
        }
    }
} = CONSTANTS


export default (essentials) => {
    return new Promise((resolve, reject) => {
        if (essentials && essentials[CUSTOMER] && essentials[CUSTOMER][CUSTOMER_NAME] && essentials[CUSTOMER][MODULE_NAME]) {
            isFileExisting(`${essentials[FILE][CUSTOMER_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][MODULE_NAME]}`, `${essentials[CUSTOMER][RULE_SET_TYPE]}`, `${JS}`).then((isExisting) => {
                if (isExisting) {
                    essentials[CUSTOMER][MODULE_PATH] = `${essentials[FILE][CUSTOMER_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][MODULE_NAME]}`
                    essentials[CUSTOMER][ADD_PLATFORM_FILE] = false
                    console.log(DATA_ALREADY_PRESENT)
                } else {
                    createFile(`${essentials[FILE][CUSTOMER_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][MODULE_NAME]}`, `${essentials[CUSTOMER][RULE_SET_TYPE]}`, `${JS}`).then((fileCreationStatus) => {
                      essentials[CUSTOMER][ADD_PLATFORM_FILE] = true
                        createFile(`${essentials[FILE][CUSTOMER_TEST_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][MODULE_NAME]}`, `${essentials[CUSTOMER][RULE_SET_TYPE]}`, `${SPEC}`)
                            .then(() => {
                                essentials[CUSTOMER][MODULE_PATH] = `${essentials[FILE][CUSTOMER_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][MODULE_NAME]}`
                                resolve()
                            })
                            .catch(() => {
                                console.log(COULD_NOT_CREATE_AXUS_TEST_FILE)
                                resolve()
                            })
                    })
                        .catch((fileCreationStatus) => {
                            reject()
                        })
                }
                resolve()
            }).catch((nonExisting) => {
                reject()
            })
        } else {
            reject()
        }
    })
}