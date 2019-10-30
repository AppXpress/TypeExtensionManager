import cliProgress from 'cli-progress';
import fs from 'fs';
import CONSTANTS from '../../constants';
import {
  fetchDocument,
  queryDocument,
  setupSeedFile
} from '../customerUtility';

import {writeToFile} from '../fileUtility'

import node_path from 'upath'

const {
  rl,
  MESSAGES: {
    INFO: {
      DID_NOT_FETCH_DATA,
      PICKED_ENV
    }
  },
  fields: {
    CUSTOMER,
    RULE_SET_TYPE,
    IS_CONFIG,
    PO_NUMBERS_LIST,
    CUSTOMER_NAME,
    QUERIED_OBJECTS,
    FETCHED_OBJECTS,
    DOCUMENT_TYPE,
    FILE,
    CUSTOMER_TEST_DIRECTORY,
    ENVIRONMENT,
    HTTP_HEADER,
    USER,
    AUTHORIZATION,
    DATA_KEY,
    SAMPLE_REF_NUMBER,
    QUERY_URL,
    FETCH_URL,
    IS_SAMPLE_REQUIRED,
    ORDERS_FIELD,
    MODULE_NAME
  },
  QUESTIONS: {
    QUESTION_SAMPLE_DATA_REQUEST,
    QUESTION_SAMPLE_DATA,
    QUESTION_PICK_ENV,
  },
  FILES: {
    EXTENSIONS: {
      _JSON
    },
    RESOURCES
  },
  GENERAL: {
    AFFIRM,
    NEGATIVE,
    SEED
  },
  GTNEXUS: {
    SUPQ_URL,
    PREPROD_URL
  },
  DOCTYPES: {
    PO,
    INV,
    PP,
    PL,
  },
  GENERAL_GTNEXUS_OBJECTS: {
    PO_NUMBER
  },
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
    if (essential[IS_CONFIG]) {
      settingupSampleData(essential, essential[CUSTOMER][IS_SAMPLE_REQUIRED]).then(() => {
        resolve()
      }).catch(() => {
        reject()
      })
    } else {
      rl.question(`${QUESTION_SAMPLE_DATA_REQUEST}`, (isDataRequired) => {
        settingupSampleData(essential, isDataRequired).then(() => {
          resolve()
        }).catch(() => {
          reject()
        })
      })
    }
  })
}

let constructHeaderRequestOptions = (essential) => {
  HTTP_HEADER.headers.Authorization = `${essential[USER][AUTHORIZATION]}`
  HTTP_HEADER.headers.dataKey = `${essential[USER][DATA_KEY]}`
  return HTTP_HEADER
}

let prepareDocumentRequestUrl = (essential) => {
  return new Promise((resolve, reject) => {
    if (essential[IS_CONFIG]) {
      prepareDocumentUrl(essential, essential[CUSTOMER][SAMPLE_REF_NUMBER])
      resolve(essential)
    } else {
      rl.question(`${QUESTION_SAMPLE_DATA}`, (sampleRefNumber) => {
        if (sampleRefNumber) {
          prepareDocumentUrl(essential, sampleRefNumber)
          resolve(essential)
        } else {
          reject(essential)
        }
      })
    }
  })
}

let setupSampleData = (essential, options) => {
  return new Promise(async (resolve, reject) => {
    let queriedObject = await queryDocument(essential, options)
    let fetchedObject = await fetchDocument(queriedObject, essential, options)
    let poData = await fetchRelatedOrders(essential, fetchedObject, options)
    let seed = await setupSeedFile(essential, poData)
    setupResources(essential, seed, SEED)
    setupResources(essential, JSON.stringify(fetchedObject, null, 4), null)
    resolve()
  })
}

let fetchRelatedOrders = (essential, fetchedObject, options) => {
  return new Promise(async (resolve, reject) => {
    let poNumbers = []
    let poData = {}
    if (essential[CUSTOMER][DOCUMENT_TYPE] === INV.FULL_FORM) {
      const ordersField = INV[ORDERS_FIELD]
      poNumbers = [...new Set(fetchedObject[ordersField].map(item => item[PO_NUMBER]))]
    } else if ([PP.FULL_FORM, PL.FULL_FORM].includes(essential[CUSTOMER][DOCUMENT_TYPE])) {
      const ordersField = PP[ORDERS_FIELD]
      poNumbers = [...new Set(fetchedObject[ordersField].map(item => item[PO_NUMBER]))]
    } else {
      poNumbers.push(essential[CUSTOMER][SAMPLE_REF_NUMBER])
    }
    essential[CUSTOMER][PO_NUMBERS_LIST] = poNumbers

    let i = 0;
    for (i; i < poNumbers.length; i++) {
      let quriedPoObject = await queryDocument(essential, options, poNumbers[i])
      let fetchedPoObject = await fetchDocument(quriedPoObject, essential, options, poNumbers[i])
      if (!poData.queriedPoObjects) {
        poData[QUERIED_OBJECTS] = []
      }
      if (!poData.fetchedPoObjects) {
        poData[FETCHED_OBJECTS] = []
      }
      poData[QUERIED_OBJECTS].push(quriedPoObject)
      poData[FETCHED_OBJECTS].push(fetchedPoObject)
    }
    resolve(poData)
  })
}

let setupResources = (essentials, data, docType, suffix) => {
   writeToFile(`${essentials[FILE][CUSTOMER_TEST_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][MODULE_NAME]}/${RESOURCES}`,`${docType||essentials[CUSTOMER][DOCUMENT_TYPE]}`, `${_JSON}`, data)
  // fs.writeFileSync(`${essentials[FILE][CUSTOMER_TEST_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][MODULE_NAME]}/${RESOURCES}/${docType||essentials[CUSTOMER][DOCUMENT_TYPE]}${_JSON}`, data)
}

let settingupSampleData = (essential, isDataRequired) => {
  return new Promise((resolve, reject) => {
    if (isDataRequired && AFFIRM.includes(isDataRequired.toUpperCase())) {
      rl.question(`${QUESTION_PICK_ENV}`, (pickedEnv) => {
        if (pickedEnv) {
          switch (pickedEnv) {
            case `1`:
              essential[ENVIRONMENT] = SUPQ_URL
              break
            case `2`:
              // essential[ENVIRONMENT] = PREPROD_URL FUTURE SUPPORT
              essential[ENVIRONMENT] = SUPQ_URL
              console.log(`\n\n!!!!IMPORTANT PREPROD SUPPORT IS STILL UNDER DEVELOPMENT. SWITCHING TO SUPPORTQ ENVIRONMENT!!!!\n\n`)
              break
            default:
              essential[ENVIRONMENT] = SUPQ_URL
              break
          }
        }
        console.log(`${PICKED_ENV} ${essential[ENVIRONMENT]}`);
        let options = constructHeaderRequestOptions(essential)
        prepareDocumentRequestUrl(essential).then((essential) => {
            setupSampleData(essential, options).then((requestedData) => {
                resolve(requestedData)
              })
              .catch((failedData) => {
                reject(failedData)
              })
          })
          .catch((essential) => {
            reject(essential)
          })

      })
      essential[CUSTOMER][IS_SAMPLE_REQUIRED] = `${AFFIRM[1]}`
    } else {
      console.log(`${DID_NOT_FETCH_DATA}`)
      essential[CUSTOMER][IS_SAMPLE_REQUIRED] = `${NEGATIVE[1]}`
      resolve()
    }
  })
}

let prepareDocumentUrl = (essential, sampleRefNumber) => {
  if (sampleRefNumber) {
    let queryUrl = ""
    let fetchUrl = ""
    let documentType = essential[CUSTOMER][DOCUMENT_TYPE]
    switch (documentType.toLowerCase()) {
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
        queryUrl += `${essential[ENVIRONMENT]}/${PL.QUERY_URL}"${sampleRefNumber}"`
        fetchUrl += `${essential[ENVIRONMENT]}/${PL.FETCH_URL}/`
        essential[CUSTOMER][SAMPLE_REF_NUMBER] = sampleRefNumber
        essential[CUSTOMER][QUERY_URL] = queryUrl
        essential[CUSTOMER][FETCH_URL] = fetchUrl
        break
      case PP.SHORT_FORM.toLowerCase():
      case PP.FULL_FORM.toLowerCase():
      case PP.PACKING_PLAN.toLowerCase():
        queryUrl += `${essential[ENVIRONMENT]}/${PP.QUERY_URL}"${sampleRefNumber}"`
        fetchUrl += `${essential[ENVIRONMENT]}/${PP.FETCH_URL}/`
        essential[CUSTOMER][SAMPLE_REF_NUMBER] = sampleRefNumber
        essential[CUSTOMER][QUERY_URL] = queryUrl
        essential[CUSTOMER][FETCH_URL] = fetchUrl
        break
    }
  }
}
