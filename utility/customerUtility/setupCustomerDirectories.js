import CONSTANTS from '../../constants'
import {createFile, createFolder} from '../fileUtility'
const {
    rl,
    QUESTIONS:{QUESTION_RULESET_TYPE},
    EVENTS:{POP,POPS,POPULATION,POPULATIONS,VALIDATION,VALIDATIONS,VLD,VLDS},
    MESSAGES:{ERRORS:{NO_RULESET_TYPE_RPOVIDED}},
    fields:{CUSTOMER, RULE_SET_TYPE,CUSTOMER_NAME, DOCUMENT_TYPE, FILE, CUSTOMER_DIRECTORY},
    RULE_SET:{POP_RULE_SET, VLD_RULE_SET},
    FILES:{EXTENSIONS:{JS}}
} = CONSTANTS



export default (essential) => {
    return new Promise((resolve, reject) => {
        if(essential[CUSTOMER] && essential[CUSTOMER][CUSTOMER_NAME]){
            const customerName = essential[CUSTOMER][CUSTOMER_NAME]
            const fileName = essential[CUSTOMER][RULE_SET_TYPE]
            createFolder(`${essential[FILE][CUSTOMER_DIRECTORY]}/${customerName}/${essential[CUSTOMER][DOCUMENT_TYPE]}`,`${essential[CUSTOMER][RULE_SET_TYPE]}`)
            .then((customerFolderCreationStauts) => {
                console.log(customerFolderCreationStauts)
            })
            .catch((customerFolderCreationStauts) => {
                console.log(customerFolderCreationStauts)
            })
        }else{
            reject(new Error(status))
        }
    })
}