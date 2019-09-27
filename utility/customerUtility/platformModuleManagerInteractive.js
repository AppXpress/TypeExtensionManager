import CONSTANTS from '../../constants'
import cmd from 'node-cmd'
import {createFile, createFolder, writeToFile} from '../fileUtility'
const {
    rl,
    QUESTIONS:{QUESTION_RULESET_TYPE},
    EVENTS:{POP,POPS,POPULATION,POPULATIONS,VALIDATION,VALIDATIONS,VLD,VLDS},
    MESSAGES:{INFO:{DID_NOT_FETCH_DATA, PICKED_ENV}},
    fields:{CUSTOMER, RULE_SET_TYPE, OBJECT_FIELDS, PO_NUMBERS_LIST,CUSTOMER_NAME, DOCUMENT_TYPE, DOC_SHORT_FORM, FILE, CUSTOMER_DIRECTORY, CUSTOMER_TEST_DIRECTORY, ENVIRONMENT, HTTP_HEADER, USER, AUTHORIZATION, DATA_KEY, SAMPLE_REF_NUMBER, QUERY_URL, FETCH_URL, IS_SAMPLE_REQUIRED},
    RULE_SET:{POP_RULE_SET, VLD_RULE_SET},
    QUESTIONS:{QUESTION_SAMPLE_DATA_REQUEST, QUESTION_SAMPLE_DATA, QUESTION_PICK_ENV, QUESTION_SAMPLE_PO_DATA},
    FILES:{EXTENSIONS:{_JSON}, RESOURCES}, 
    GENERAL:{AFFIRM, NEGATIVE, GET, POST},
    GTNEXUS:{SUPQ_URL, PREPROD_URL},
    DOCTYPES: {PO, INV, PP,PL, DOC},
    DOCTYPES,
    GENERAL_GTNEXUS_OBJECTS:{RESULT, SHIPMENT_ITEM, PO_NUMBER},
} = CONSTANTS


export default (essential) => {
    return new Promise((resolve, reject) => {
        cmd.get(`
        pmm build -c "${essential[CUSTOMER][CUSTOMER_NAME]}" -m "${essential[CUSTOMER][DOCUMENT_TYPE]}/${essential[CUSTOMER][RULE_SET_TYPE]}"
        `, (err, data, stderr) =>{
            console.log(err+" "+data+" "+stderr)
        })
        console.log()
    })
}

class PMM{

}