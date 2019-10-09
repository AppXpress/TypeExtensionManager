import createFile from '../fileUtility/createFile'
import isFileExisting from '../fileUtility/isFileExisting'
import readFromFile from '../fileUtility/readFromFile'
import CONSTANTS from '../../constants'

const {
    fields: {
        CUSTOMER,
        RANK,
        MODULE_PATH,
        DOCUMENT_TYPE,
        ADD_PLATFORM_FILE
    },
    FILES:{
        EXTENSIONS:{
            XML
        }
    },
    PLATFORM: {
        FILES,
        FOLDERS: {
            $TYPE_EXTENSION_D1,
            TYPE_EXTENSION_SCRIPT
        }
    }
} = CONSTANTS

export default (essentials) => {
    return new Promise(async (resolve, reject) => {
        const $typeExtensionD1 = `${essentials[CUSTOMER][MODULE_PATH]}/${$TYPE_EXTENSION_D1}`
        FILES.SET_FILE_NAME = `${essentials[CUSTOMER][DOCUMENT_TYPE]}`
        let boolIsFileExisting = true
        let rank = 0
        while(boolIsFileExisting) {
            rank+=10
            FILES.SET_RANK = rank
            FILES.SET_FILE_NAME = `${essentials[CUSTOMER][DOCUMENT_TYPE]}`
            boolIsFileExisting = await isFileExisting(`${$typeExtensionD1}`, `${FILES.GET_FILE_NAME}`, `${XML}`)
        }
        if(essentials[CUSTOMER][ADD_PLATFORM_FILE]){
            await createFile($typeExtensionD1, FILES.GET_FILE_NAME, `${XML}`)
            essentials[CUSTOMER][RANK] = FILES.GET_RANK
        }
        resolve()
    })
}
