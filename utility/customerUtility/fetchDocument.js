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
    fields:{CUSTOMER, RULE_SET_TYPE, OBJECT_FIELDS, PO_NUMBERS_LIST,CUSTOMER_NAME, DOCUMENT_TYPE, DOC_SHORT_FORM, FILE, CUSTOMER_DIRECTORY, CUSTOMER_TEST_DIRECTORY, ENVIRONMENT, HTTP_HEADER, USER, AUTHORIZATION, DATA_KEY, SAMPLE_REF_NUMBER, QUERY_URL, FETCH_URL, IS_SAMPLE_REQUIRED},
    RULE_SET:{POP_RULE_SET, VLD_RULE_SET},
    QUESTIONS:{QUESTION_SAMPLE_DATA_REQUEST, QUESTION_SAMPLE_DATA, QUESTION_PICK_ENV, QUESTION_SAMPLE_PO_DATA},
    FILES:{EXTENSIONS:{_JSON}, RESOURCES}, 
    GENERAL:{AFFIRM, NEGATIVE, GET, POST},
    GTNEXUS:{SUPQ_URL, PREPROD_URL},
    DOCTYPES: {PO, INV, PP,PL, DOC},
    DOCTYPES,
    GENERAL_GTNEXUS_OBJECTS:{RESULT, SHIPMENT_ITEM, PO_NUMBER, META_DATA, UID},
} = CONSTANTS

export default (queriedObject, essential, options, poNumber) => {
    if(!poNumber){
        return new Promise((resolve, reject) => {
            if(essential[CUSTOMER][QUERY_URL] && essential[CUSTOMER][FETCH_URL] && queriedObject){
                if(queriedObject && queriedObject[RESULT] && queriedObject[RESULT].length > 0){
                    let objectUid = queriedObject[RESULT][0][DOCTYPES[`${essential[CUSTOMER][DOC_SHORT_FORM]}`][OBJECT_FIELDS][Object.keys(DOCTYPES[`${essential[CUSTOMER][DOC_SHORT_FORM]}`][OBJECT_FIELDS])]]
                    needle(GET, `${essential[CUSTOMER][FETCH_URL]}${objectUid}`, options)
                    .then((result) => {
                        let fetchedObject = result.body
                        resolve(fetchedObject)
                    })
                    .catch((err) =>{
                        reject(err)
                    })
                }
            }
        })
    }else{
        if(Array.isArray(queriedObject.result)){
            return new Promise((resolve, reject) => {
                let poUid = queriedObject.result[0][META_DATA][UID]
                let fetchUrl = `${essential[ENVIRONMENT]}/${PO.FETCH_URL}/${poUid}`
                needle(GET, `${fetchUrl}`, options)
                .then((result) => {
                    let fetchedObject = result.body
                    resolve(fetchedObject)
                })
                .catch((err) => {
                    reject(err)
                })
            })
        }
    }
}