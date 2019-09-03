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
    GENERAL_GTNEXUS_OBJECTS:{RESULT, SHIPMENT_ITEM, PO_NUMBER},
} = CONSTANTS

const progressBar = new cliProgress.SingleBar({
    barCompleteChar: '#',
    barIncompleteChar: '.',
    fps: 10,
    stream: process.stdout,
    barsize: 65,
}, cliProgress.Presets.shades_classic)

export default (essential) => {
    return new Promise((resolve, reject) => {
        rl.question(`${QUESTION_SAMPLE_DATA_REQUEST}`, (isDataRequired) => {
            if(isDataRequired && AFFIRM.includes(isDataRequired.toUpperCase())){
                rl.question(`${QUESTION_PICK_ENV}`, (pickedEnv) => {
                    if(pickedEnv){
                        switch(pickedEnv){
                            case `1`:
                                essential[ENVIRONMENT] = SUPQ_URL
                                break
                            case `2`:
                                essential[ENVIRONMENT] = PREPROD_URL
                                break
                            default:
                                essential[ENVIRONMENT] = SUPQ_URL
                                break        
                        }
                    }
                    console.log(`${PICKED_ENV} ${essential[ENVIRONMENT]}`);
                    let options = constructHeaderRequestOptions(essential)
                    prepareDocumentRequestUrl(essential).then((essential) => {
                        getSampleData(essential, options).then((requestedData) => {
                            resolve(essential)
                        })
                        .catch((failedData) => {

                        })
                    })
                    .catch((essential) => {

                    })
                    
                })
                essential[CUSTOMER][IS_SAMPLE_REQUIRED] = `${AFFIRM[1]}`
            }else{
                console.log(`${DID_NOT_FETCH_DATA}`)
                essential[CUSTOMER][IS_SAMPLE_REQUIRED] = `${NEGATIVE[1]}`
                resolve()
            }
        })
    })
}

let constructHeaderRequestOptions = (essential) => {
    HTTP_HEADER.headers.Authorization = `${essential[USER][AUTHORIZATION]}`
    HTTP_HEADER.headers.dataKey = `${essential[USER][DATA_KEY]}`
    return HTTP_HEADER
}

let prepareDocumentRequestUrl = (essential) => {
    return new Promise((resolve, reject) => {
        rl.question(`${QUESTION_SAMPLE_DATA}`, (sampleRefNumber) => {
            if(sampleRefNumber){
                let queryUrl = ""
                let fetchUrl = ""
                let documentType = essential[CUSTOMER][DOCUMENT_TYPE]
                switch(documentType.toLowerCase()){
                    case PO.SHORT_FORM.toLowerCase():
                    case PO.FULL_FORM.toLowerCase():
                    case PO.ORDER.toLowerCase():
                        queryUrl += `${essential[ENVIRONMENT]}/${PO.QUERY_URL}"${sampleRefNumber}"`
                        fetchUrl += `${essential[ENVIRONMENT]}/${PO.FETCH_URL}/`
                        essential[CUSTOMER][SAMPLE_REF_NUMBER] = sampleRefNumber
                        essential[CUSTOMER][QUERY_URL] = queryUrl
                        essential[CUSTOMER][FETCH_URL] = fetchUrl
                        break
                    case INV.SHORT_FORM.toLowerCase():
                    case INV.FULL_FORM.toLowerCase():
                    case INV.INVOICE.toLowerCase():
                        queryUrl += `${essential[ENVIRONMENT]}/${INV.QUERY_URL}"${sampleRefNumber}"`
                        fetchUrl += `${essential[ENVIRONMENT]}/${INV.FETCH_URL}/`
                        essential[CUSTOMER][SAMPLE_REF_NUMBER] = sampleRefNumber
                        essential[CUSTOMER][QUERY_URL] = queryUrl
                        essential[CUSTOMER][FETCH_URL] = fetchUrl
                        break
                    case PL.SHORT_FORM.toLowerCase():
                    case PL.FULL_FORM.toLowerCase():
                    case PL.PACKING_LIST.toLowerCase():
                        fetchUrl += `${essential[ENVIRONMENT]}/${PL.FETCH_URL}/${sampleRefNumber}`
                        essential[CUSTOMER][SAMPLE_REF_NUMBER] = sampleRefNumber
                        essential[CUSTOMER][FETCH_URL] = fetchUrl
                        break
                    case PP.SHORT_FORM.toLowerCase():
                    case PP.FULL_FORM.toLowerCase():
                    case PP.PACKING_PLAN.toLowerCase():
                        fetchUrl += `${essential[ENVIRONMENT]}/${PP.FETCH_URL}/${sampleRefNumber}`
                        essential[CUSTOMER][SAMPLE_REF_NUMBER] = sampleRefNumber
                        essential[CUSTOMER][FETCH_URL] = fetchUrl
                        break
                }
                resolve(essential)
            }else{
                reject(essential)
            }
        })
    })
}
//PENDING -- GET SAMPLE DATA
let getSampleData = (essential, options) => {
    return new Promise((resolve, reject) => {
        if(essential[CUSTOMER][QUERY_URL]){
            if(essential[CUSTOMER][FETCH_URL]){
                needle(GET, essential[CUSTOMER][QUERY_URL], options).then((res) => {
                    let queriedObject = res.body
                    if(queriedObject && queriedObject[RESULT] && queriedObject[RESULT].length > 0){
                        var objectUid = queriedObject[RESULT][0][DOCTYPES[`${essential[CUSTOMER][DOC_SHORT_FORM]}`][OBJECT_FIELDS][Object.keys(DOCTYPES[`${essential[CUSTOMER][DOC_SHORT_FORM]}`][OBJECT_FIELDS])]]
                        needle(GET, `${essential[CUSTOMER][FETCH_URL]}${objectUid}`, options).then((res) => {
                            let fetchedObject = res.body
                            setupResources(essential, JSON.stringify(fetchedObject, null, 4), null)
                            resolve(fetchedObject)
                        })
                        .catch((failedResult) => {
                            reject({})                            
                        })
                    }                
                })
                .catch((failedResult) => {
                    reject({})                                
                })
            }
        }else if(essential[CUSTOMER][FETCH_URL]){
            needle(GET, essential[CUSTOMER][FETCH_URL], options).then((res) => {
                let fetchedObject = res.body
                setupResources(essential, JSON.stringify(fetchedObject, null, 4), null)
                rl.question(QUESTION_SAMPLE_PO_DATA, (questionfetchRelatedOrders) => {
                    if(AFFIRM.includes(questionfetchRelatedOrders.toUpperCase())){
                        progressBar.start(100, 0)
                        fetchRelatedOrders(essential, fetchedObject, options).then((orderMap) => {
                            orderMap.forEach((order) => {
                                progressBar.update(100*(100/orderMap.length))
                                setupResources(essential, JSON.stringify(order, null, 4), order[PO_NUMBER])
                            })
                            progressBar.stop()
                            resolve(fetchedObject)
                        }).catch((failedFetchingOrders) => {
                            resolve(failedFetchingOrders)
                        })
                    }else{
                        
                    }
                })
            })                
            .catch((failedResult) => {
                reject({})
            })
        }else{
            reject({})    
        }
    })
}


let fetchRelatedOrders = (essential, manifest, options) => {
    return new Promise((resolve, reject) => {
        if(manifest[SHIPMENT_ITEM]){
            let poNumbers = [...new Set(manifest[SHIPMENT_ITEM].map(item => item[PO_NUMBER]))]
            let i = 0
            let poMap = {}
            let promises = []
            essential[CUSTOMER][PO_NUMBERS_LIST] = poNumbers
            for(i; i < poNumbers.length; i++){
                promises.push(fetchOrder(essential, poNumbers[i], options))
            }
            Promise.all(promises).then((order) => {
                poMap = order
                resolve(poMap)
            }).catch(() => {
                reject()
            })
        }
    })
}


let fetchOrder = (essential, poNumber, options) => {
    return new Promise((resolve, reject) => {
        let baseUrl = `${essential[ENVIRONMENT]}/${PO.QUERY_URL}"${poNumber}"`
        needle(GET, baseUrl, options).then((baseOrder) => {
            let orderUid = `${baseOrder.body[RESULT][0][`${PO.OBJECT_FIELDS.ORDER_UID}`]}`
            let fetchUrl = `${essential[ENVIRONMENT]}/${PO.FETCH_URL}/${orderUid}`
            needle(GET, fetchUrl, options).then((resOrderObject) => {
                let orderObject = resOrderObject.body
                resolve(orderObject)
            })
            .catch((failedOrderObject) => {
                reject(failedOrderObject)
            })
        }).catch((failedQuery) => {
            reject(failedQuery)
        })
    })
}


let setupResources = (essentials, data, docType,suffix) =>{
    fs.writeFileSync(`${essentials[FILE][CUSTOMER_TEST_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][DOCUMENT_TYPE]}/${essentials[CUSTOMER][RULE_SET_TYPE]}/${RESOURCES}/${docType||essentials[CUSTOMER][DOCUMENT_TYPE]}${_JSON}`, data)
  }