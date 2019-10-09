import {createFolder} from "../fileUtility";
import CONSTANTS from '../../constants'

const {
    fields:{
        CUSTOMER_DIRECTORY,
        CUSTOMER,
        RULE_SET_TYPE,
        MODULE_NAME,
        MODULE_PATH
    },
    PLATFORM:{
        FOLDERS:{
            $TYPE_EXTENSION_D1,
            PLATFORM_LOCALIZATION,
            TYPE_EXTENSION_SCRIPT
        }
    }
} = CONSTANTS

export default (essentials) => {
    return new Promise(async (resolve, reject) => {
        console.log(essentials)
        const $typeExtensionPathD1 = `${essentials[CUSTOMER][MODULE_PATH]}/${$TYPE_EXTENSION_D1}`
        const platformLocalization = `${essentials[CUSTOMER][MODULE_PATH]}/${PLATFORM_LOCALIZATION}`
        const typeExtensionScript = `${essentials[CUSTOMER][MODULE_PATH]}/${TYPE_EXTENSION_SCRIPT}`

        await createFolder($typeExtensionPathD1)
        await createFolder(platformLocalization)
        await createFolder(typeExtensionScript)
        resolve()
    })
}