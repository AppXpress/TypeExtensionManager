import needle from 'needle';
import CONSTANTS from '../../constants';
import moment from "moment";
import {setupSampleData} from "./index";
const {
  fields: {
    CUSTOMER,
    OBJECT_FIELDS,
    DOC_SHORT_FORM,
    ENVIRONMENT,
    QUERY_URL,
    FETCH_URL,
    UID: OBJECT_UID,
    DOCUMENT_TYPE,
    SAMPLE_REF_NUMBER,
  },
  GENERAL: {
    GET,
  },
  DOCTYPES: {
    PO,
  },
  DOCTYPES,
  GENERAL_GTNEXUS_OBJECTS: {
    RESULT,
    META_DATA,
    UID
  },
    MESSAGES:{
    INFO:{
      DOCUMENT_NOT_EXISTING
    }
    },
  rl
} = CONSTANTS

export default (queriedObject, essential, options, poNumber) => {
  if (!poNumber) {
    return new Promise((resolve, reject) => {
      if (essential[CUSTOMER][QUERY_URL] && essential[CUSTOMER][FETCH_URL] && queriedObject) {
        if (queriedObject && queriedObject[RESULT] && queriedObject[RESULT].length > 0) {
          try{
            //item => `${item[`${DOCTYPES[essential[CUSTOMER][DOC_SHORT_FORM]][OBJECT_UID]}`]} BUYER:${item['party']['Buyer'][0]['name']}\t\t\t\tCREATED_TIMESTAMP: ${moment(item['__metadata']['createTimestamp']).format("MM-DD-YYYY")}`
            let objectUidsList = [...new Set(queriedObject[RESULT].map((item) => {
              return {
                UID: `${item[`${DOCTYPES[essential[CUSTOMER][DOC_SHORT_FORM]][OBJECT_UID]}`]}`,
                BUYER: `${item['party']['Buyer'][0]['name']}`,
                CREATED_TIMESTAMP: `${moment(item['__metadata']['createTimestamp']).format("MM-DD-YYYY")}`
              }
            }))]
            let objectUid = null
            if(objectUidsList.length > 1){
              let i = 0;
              console.log(`-----------------------------------------------------------------------------------------------------------`)
              console.log(`|S#|   |CREATED_ON| \t\t\t\t|OBJECT_UID|  \t\t\t\t\t|BUYER_ORG|`)
              console.log(`-----------------------------------------------------------------------------------------------------------`)
              for(i; i < objectUidsList.length; i++){
                console.log(`[${i+1}]   ${objectUidsList[i].CREATED_TIMESTAMP} \t\t\t\t${objectUidsList[i].UID}   \t\t\t\t\t${objectUidsList[i].BUYER}`)
              }
              rl.question(`Looks like there are too many ${essential[CUSTOMER][DOCUMENT_TYPE]}'s with the same ${DOCTYPES[essential[CUSTOMER][DOC_SHORT_FORM]].SHORT_FORM}:#${essential[CUSTOMER][SAMPLE_REF_NUMBER]}. Please choose a UID:\n`, (uidOption) => {
                objectUid = objectUidsList[uidOption-1]
                needle(GET, `${essential[CUSTOMER][FETCH_URL]}${objectUid}`, options)
                    .then((result) => {
                      let fetchedObject = result.body
                      resolve(fetchedObject)
                    })
                    .catch((err) => {
                      reject(err)
                    })
              })
            }else{
              objectUid = queriedObject[RESULT][0][DOCTYPES[`${essential[CUSTOMER][DOC_SHORT_FORM]}`][OBJECT_FIELDS][Object.keys(DOCTYPES[`${essential[CUSTOMER][DOC_SHORT_FORM]}`][OBJECT_FIELDS])]]
              needle(GET, `${essential[CUSTOMER][FETCH_URL]}${objectUid}`, options)
                  .then((result) => {
                    let fetchedObject = result.body
                    resolve(fetchedObject)
                  })
                  .catch((err) => {
                    reject(err)
                  })
            }
          }catch (e) {

          }
        }else{
          console.log(`\n***INFO: ${DOCUMENT_NOT_EXISTING} ${essential[CUSTOMER][DOCUMENT_TYPE]}#:${essential[CUSTOMER][SAMPLE_REF_NUMBER]}***\n`)
          setupSampleData(essential).then(()=> resolve())
        }
      }
    })
  } else {
    if (Array.isArray(queriedObject.result)) {
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