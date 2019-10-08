import needle from 'needle';
import CONSTANTS from '../../constants';
const {
  fields: {
    CUSTOMER,
    OBJECT_FIELDS,
    DOC_SHORT_FORM,
    ENVIRONMENT,
    QUERY_URL,
    FETCH_URL,
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
} = CONSTANTS

export default (queriedObject, essential, options, poNumber) => {
  if (!poNumber) {
    return new Promise((resolve, reject) => {
      if (essential[CUSTOMER][QUERY_URL] && essential[CUSTOMER][FETCH_URL] && queriedObject) {
        if (queriedObject && queriedObject[RESULT] && queriedObject[RESULT].length > 0) {
          let objectUid = queriedObject[RESULT][0][DOCTYPES[`${essential[CUSTOMER][DOC_SHORT_FORM]}`][OBJECT_FIELDS][Object.keys(DOCTYPES[`${essential[CUSTOMER][DOC_SHORT_FORM]}`][OBJECT_FIELDS])]]
          needle(GET, `${essential[CUSTOMER][FETCH_URL]}${objectUid}`, options)
            .then((result) => {
              let fetchedObject = result.body
              resolve(fetchedObject)
            })
            .catch((err) => {
              reject(err)
            })
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