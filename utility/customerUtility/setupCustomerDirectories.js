import CONSTANTS from '../../constants'
import {createFile, createFolder} from '../fileUtility'
const {
    rl,
    QUESTIONS:{QUESTION_RULESET_TYPE},
    EVENTS:{POP,POPS,POPULATION,POPULATIONS,VALIDATION,VALIDATIONS,VLD,VLDS},
    MESSAGES:{INFO:{COULD_NOT_CREATE_TEST_FOLDER}},
    fields:{CUSTOMER, RULE_SET_TYPE,CUSTOMER_NAME, DOCUMENT_TYPE, FILE, CUSTOMER_DIRECTORY, CUSTOMER_TEST_DIRECTORY},
    RULE_SET:{POP_RULE_SET, VLD_RULE_SET},
    FILES:{EXTENSIONS:{JS}, RESOURCES}
} = CONSTANTS



export default (essential) => {
    return new Promise((resolve, reject) => {
        if(essential[CUSTOMER] && essential[CUSTOMER][CUSTOMER_NAME]){
            const customerName = essential[CUSTOMER][CUSTOMER_NAME]
            createFolder(`${essential[FILE][CUSTOMER_DIRECTORY]}/${customerName}/${essential[CUSTOMER][DOCUMENT_TYPE]}`,`${essential[CUSTOMER][RULE_SET_TYPE]}`)
            .then((customerFolderCreationStauts) => {
                createFolder(`${essential[FILE][CUSTOMER_TEST_DIRECTORY]}/${customerName}/${essential[CUSTOMER][DOCUMENT_TYPE]}`,`${essential[CUSTOMER][RULE_SET_TYPE]}`)
                    .then(()=>{
                        createFolder(`${essential[FILE][CUSTOMER_TEST_DIRECTORY]}/${customerName}/${essential[CUSTOMER][DOCUMENT_TYPE]}/${essential[CUSTOMER][RULE_SET_TYPE]}`,`${RESOURCES}`)
                        resolve()
                    })
                    .catch(()=>{
                        console.log(COULD_NOT_CREATE_TEST_FOLDER)
                        resolve()
                    })
                console.log(customerFolderCreationStauts)
            })
            .catch((customerFolderCreationStauts) => {
                console.log(customerFolderCreationStauts)
                resolve()
            })
        }else{
            reject(new Error(status))
        }
    })
}