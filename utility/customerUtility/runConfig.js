import needle from 'needle'
import fs from 'fs'
import cliProgress from 'cli-progress'
import CONSTANTS from '../../constants'
import configRl from "readline"
const {
    rl,
    QUESTIONS:{QUESTION_RULESET_TYPE},
    EVENTS:{POP,POPS,POPULATION,POPULATIONS,VALIDATION,VALIDATIONS,VLD,VLDS},
    MESSAGES:{INFO:{DID_NOT_FETCH_DATA, PICKED_ENV}},
    fields:{CUSTOMER, RULE_SET_TYPE, IS_CONFIG, OBJECT_FIELDS, QUERIED_OBJECTS, FETCHED_OBJECTS, PO_NUMBERS_LIST,CUSTOMER_NAME, DOCUMENT_TYPE, DOC_SHORT_FORM, JIRA_NUMBER, CUSTOMER_DIRECTORY, CUSTOMER_TEST_DIRECTORY, ENVIRONMENT, HTTP_HEADER, USER, AUTHORIZATION, DATA_KEY, SAMPLE_REF_NUMBER, QUERY_URL, FETCH_URL, SEED_QUERY_FIELD, IS_SAMPLE_REQUIRED, DOCUMENT_FETCH_URL, DOCUMENT_QUERY_URL, UID},
    RULE_SET:{POP_RULE_SET, VLD_RULE_SET},
    QUESTIONS:{QUESTION_SAMPLE_DATA_REQUEST, QUESTION_SAMPLE_DATA, QUESTION_PICK_ENV, QUESTION_SAMPLE_PO_DATA},
    FILES:{EXTENSIONS:{_JSON}, RESOURCES}, 
    GENERAL:{AFFIRM, NEGATIVE, GET, POST},
    GTNEXUS:{SUPQ_URL, PREPROD_URL},
    DOCTYPES: {PO, INV, PP,PL, DOC},
    DOCTYPES,
    GENERAL_GTNEXUS_OBJECTS:{RESULT, PO_NUMBER},
} = CONSTANTS


export default (essential, documentType, rulesetType) =>{
    let ARR_DOCUMENT_TYPE = ["PO","INV", "PP", "PL"]
    let ARR_RULE_SET_TYPE = ["POP", "VLD"]
    return new Promise((resolve, reject) => {
        console.log(documentType+ " "+ rulesetType)
        if(ARR_DOCUMENT_TYPE.includes(documentType.toUpperCase()) && ARR_RULE_SET_TYPE.includes(rulesetType.toUpperCase())){
            let configFileType = documentType+`_`+rulesetType
            let config = require('../../configs/'+configFileType.toLowerCase()+'.json')
            essential[CUSTOMER] = {}
            essential[IS_CONFIG] = `Y`
            essential[CUSTOMER][CUSTOMER_NAME] = config[CUSTOMER_NAME]
            essential[CUSTOMER][DOCUMENT_TYPE] = config[DOCUMENT_TYPE]
            essential[CUSTOMER][JIRA_NUMBER] = config[JIRA_NUMBER]
            essential[CUSTOMER][IS_SAMPLE_REQUIRED] = config[IS_SAMPLE_REQUIRED]
            essential[CUSTOMER][SAMPLE_REF_NUMBER] = config[SAMPLE_REF_NUMBER]
            essential[CUSTOMER][RULE_SET_TYPE] = config[RULE_SET_TYPE]
        }
        console.log(essential)
    })
}