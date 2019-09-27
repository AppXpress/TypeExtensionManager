import {createFile, isFileExisting} from '../fileUtility'
import CONSTANTS from '../../constants'
const {
    fields:{CUSTOMER, RULE_SET_TYPE,CUSTOMER_NAME, FILE, CUSTOMER_DIRECTORY, DOCUMENT_TYPE, CUSTOMER_TEST_DIRECTORY},
    FILES:{EXTENSIONS:{JS, SPEC}},
    MESSAGES:{INFO:{COULD_NOT_CREATE_AXUS_TEST_FILE, DATA_ALREADY_PRESENT}}
} = CONSTANTS


export default (essentials) => {
    return new Promise((resolve, reject) => {
        if(essentials && essentials[CUSTOMER] && essentials[CUSTOMER][CUSTOMER_NAME] && essentials[CUSTOMER][RULE_SET_TYPE]){
            isFileExisting(`${essentials[FILE][CUSTOMER_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][RULE_SET_TYPE]}`, `${essentials[CUSTOMER][RULE_SET_TYPE]}`, `js`).then((isExisting) => {
                console.log(DATA_ALREADY_PRESENT)
                resolve()
            }).catch((nonExisting) => {
                createFile(`${essentials[FILE][CUSTOMER_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][RULE_SET_TYPE]}`,`${essentials[CUSTOMER][RULE_SET_TYPE]}`,`${JS}`).then((fileCreationStatus) => {
                    createFile(`${essentials[FILE][CUSTOMER_TEST_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][RULE_SET_TYPE]}`,`${essentials[CUSTOMER][RULE_SET_TYPE]}`,`${SPEC}`)
                        .then(()=>{
                            resolve()
                        })
                        .catch(()=>{
                            console.log(COULD_NOT_CREATE_AXUS_TEST_FILE)
                            resolve()
                        })
                })
                .catch((fileCreationStatus) => {
                    reject()
                })    
            })        
        }else{
            reject()
        }
    })
}
