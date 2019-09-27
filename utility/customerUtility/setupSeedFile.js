import needle from 'needle'
import fs from 'fs'
import cliProgress from 'cli-progress'
import CONSTANTS from '../../constants'
import {createFile, createFolder, writeToFile} from '../fileUtility'
const {
    rl,
    QUESTIONS:{QUESTION_RULESET_TYPE},
    EVENTS:{POP,POPS,POPULATION,POPULATIONS,VALIDATION,VALIDATIONS,VLD,VLDS},
    MESSAGES:{INFO:{DID_NOT_FETCH_DATA, PICKED_ENV}},
    fields:{CUSTOMER, RULE_SET_TYPE, OBJECT_FIELDS, QUERIED_OBJECTS, FETCHED_OBJECTS, PO_NUMBERS_LIST,CUSTOMER_NAME, DOCUMENT_TYPE, DOC_SHORT_FORM, FILE, CUSTOMER_DIRECTORY, CUSTOMER_TEST_DIRECTORY, ENVIRONMENT, HTTP_HEADER, USER, AUTHORIZATION, DATA_KEY, SAMPLE_REF_NUMBER, QUERY_URL, FETCH_URL, SEED_QUERY_FIELD, IS_SAMPLE_REQUIRED, DOCUMENT_FETCH_URL, DOCUMENT_QUERY_URL, UID},
    RULE_SET:{POP_RULE_SET, VLD_RULE_SET},
    QUESTIONS:{QUESTION_SAMPLE_DATA_REQUEST, QUESTION_SAMPLE_DATA, QUESTION_PICK_ENV, QUESTION_SAMPLE_PO_DATA},
    FILES:{EXTENSIONS:{_JSON}, RESOURCES}, 
    GENERAL:{AFFIRM, NEGATIVE, GET, POST},
    GTNEXUS:{SUPQ_URL, PREPROD_URL},
    DOCTYPES: {PO, INV, PP,PL, DOC},
    DOCTYPES,
    GENERAL_GTNEXUS_OBJECTS:{RESULT, PO_NUMBER},
} = CONSTANTS


export default (essential, poData, otherDoc) =>{
    return new Promise((resolve, reject) => {
        let queryData = ``
        let fetchData = ``
        let i = 0
        for(i; i < poData[QUERIED_OBJECTS].length; i++){
            queryData += `"${PO_NUMBER}='${poData[QUERIED_OBJECTS][i][RESULT][0][PO_NUMBER]}'":${JSON.stringify(poData[QUERIED_OBJECTS][i][RESULT][0])}${i !== poData[QUERIED_OBJECTS].length -1?",":""}`        
        }
        i = 0
        for(i; i < poData[FETCHED_OBJECTS].length; i++){
            fetchData += `"${poData[FETCHED_OBJECTS][i][PO[UID]]}":${JSON.stringify(poData[FETCHED_OBJECTS][i])}${i !== poData[FETCHED_OBJECTS].length -1?",":""}`
        }
        let seed = `
        {
            "${PO[DOCUMENT_FETCH_URL]}":{
                ${queryData},
                ${fetchData}
            }
    }    
        `
        if(seed){
            resolve(seed)
        }else{
            reject(seed)
        }
    })
}