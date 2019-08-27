import fs from 'fs'
import CONSTANTS from '../../constants'
import moment from 'moment'
const {
    fields:{CUSTOMER, DOC_SHORT_FORM, JIRA_NUMBER, USER, USER_NAME, FILE, CUSTOMER_DIRECTORY, CUSTOMER_NAME, DOCUMENT_TYPE, RULE_SET_TYPE},
    FILES:{EXTENSIONS:{JS, SPEC}},
    MESSAGES:{INFO:{COULD_NOT_CREATE_AXUS_TEST_FILE}},
    GENERAL:{DATE_FORMAT, WHO, DESCRIPTION, ENCODING_UTF8},
    MESSAGES:{INFO:{INITIAL_CODE_SETUP, NOT_MUCH_INFO, DATA_ALREADY_PRESENT}, ERRORS:{FAILED_WRITING_FILE}}
} = CONSTANTS

export default (essentials) => {
    return new Promise((resolve, reject) => {
        if(essentials && essentials[CUSTOMER][DOC_SHORT_FORM] && essentials[CUSTOMER][JIRA_NUMBER]){
            let jiraNumber = essentials[CUSTOMER][JIRA_NUMBER]
            let date = `${moment().format(DATE_FORMAT)}`
            let who = `${essentials[USER][USER_NAME].charAt(0).toUpperCase()}${essentials[USER][USER_NAME].charAt(1).toUpperCase()}`||WHO
            let description = `${DESCRIPTION}`
            let code = constructCode(essentials, jiraNumber, date, who, description)
            let data = fs.readFileSync(`${essentials[FILE][CUSTOMER_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][DOCUMENT_TYPE]}/${essentials[CUSTOMER][RULE_SET_TYPE]}/${essentials[CUSTOMER][RULE_SET_TYPE]}${JS}`, ENCODING_UTF8)
            if(data && data != ``){
                console.log(DATA_ALREADY_PRESENT)
                resolve()
            }else{
                fs.writeFileSync(`${essentials[FILE][CUSTOMER_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][DOCUMENT_TYPE]}/${essentials[CUSTOMER][RULE_SET_TYPE]}/${essentials[CUSTOMER][RULE_SET_TYPE]}${JS}`, code)
                console.log(`${INITIAL_CODE_SETUP}`)
                resolve()
            }
        }else{
            console.log(`${NOT_MUCH_INFO}`)
            resolve()
        }
    })
}


let constructCode = (essentials, jiraNumber, date, who, description)=>{
    let sampleCode = `
  /**
   *   C H A N G E    L  O G
   *
   *  (B)ug/(E)nh/(I)DB #    Date      Who  Description
   *  -------------------  ----------  ---  ---------------------------------------------------------------
   *	${jiraNumber}\t\t\t\t\t\t ${date}\t\t${who}\t${description}
   */
    function fnOnEvent(${(essentials[CUSTOMER][DOC_SHORT_FORM]).toLowerCase()}){
      /**
       * THIS IS AUTO GENERATED 
       */
      console.log(${(essentials[CUSTOMER][DOC_SHORT_FORM]).toLowerCase()})
    }
    \n\n\n\n\n\n\n\n\n
    //Utility
    function getObjectByUid(uid, objectType) { //Can be used as getObjectByUid('123456', ${(essentials[CUSTOMER][DOC_SHORT_FORM]).toLowerCase()})
      if (uid) {
        return Providers.getPersistenceProvider().createFetchRequest(objectType, 310, uid).execute();
      }
    }
    `
    return '\uFEFF'+sampleCode.replace(/\n/g, '\r\n')
}