import needle from 'needle'
import fs from 'fs'
import cliProgress from 'cli-progress'
import CONSTANTS from '../../constants'
import {createFile, createFolder, writeJSONToFile} from '../fileUtility'
import {fetchDocument} from './'

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

export default (essential, options, poNumber) => {
    if(!poNumber){
        return new Promise((resolve, reject) => {
            if(essential[CUSTOMER][QUERY_URL] && essential[CUSTOMER][FETCH_URL]){
                needle(GET, essential[CUSTOMER][QUERY_URL], options)
                .then((result) => {
                    let quriedObject = result.body
                    resolve(quriedObject)
                })
                .catch((err) =>{
                    reject(err)
                })
            }
        })
    }else{
        return new Promise(async (resolve, reject) => {
            let queryUrl = `${essential[ENVIRONMENT]}/${PO.QUERY_URL}"${poNumber}"`
            needle(GET, queryUrl, options)
            .then((result) => {
                let quriedPoObject = result.body
                // let fetchedPoObject = fetchDocument(quriedPoObject, essential)
                resolve(quriedPoObject)
            })
            .catch((err) => {
                reject(err)
            })
        })
    }
}