import CONSTANTS from '../../constants'

const {
  rl,
  QUESTIONS: {
    QUESTION_DOCUMENT_TYPE
  },
  DOCTYPES: {
    PO,
    INV,
    PP,
    PL,
    DOC
  },
  fields: {
    CUSTOMER,
    DOCUMENT_TYPE,
    DOC_SHORT_FORM,
    IS_CONFIG
  },
  MESSAGES: {
    ERRORS: {
      NO_DOC_TYPE_PROVIDED
    }
  },
  OPTIONS: {
    ONE,
    TWO,
    THREE,
    FOUR
  }
} = CONSTANTS

export default (essentials) => {
  return new Promise((resolve, reject) => {
    if (essentials[IS_CONFIG]) {
      settingDocumentType(essentials[CUSTOMER][DOCUMENT_TYPE], essentials)
      resolve()
    } else {
      rl.question(`${QUESTION_DOCUMENT_TYPE}`, (documentType) => {
        if (documentType) {
          settingDocumentType(documentType, essentials)
          resolve()
        } else {
          reject(new Error(`${NO_DOC_TYPE_PROVIDED}`))
        }
      })
    }
  })
}

let settingDocumentType = (documentType, essentials) => {
  let docType = null
  let shortForm = null
  if (documentType) {
    switch (documentType.toLowerCase()) {
      case PO.SHORT_FORM.toLowerCase():
      case PO.FULL_FORM.toLowerCase():
      case PO.ORDER.toLowerCase():
      case ONE:
        docType = PO.FULL_FORM
        shortForm = PO.SHORT_FORM
        break
      case INV.SHORT_FORM.toLowerCase():
      case INV.FULL_FORM.toLowerCase():
      case INV.INVOICE.toLowerCase():
      case TWO:
        docType = INV.FULL_FORM
        shortForm = INV.SHORT_FORM
        break
      case PP.SHORT_FORM.toLowerCase():
      case PP.FULL_FORM.toLowerCase():
      case PP.PACKING_PLAN.toLowerCase():
      case PP.PACKING_PLAN_MANIFEST.toLowerCase():
      case THREE:
        docType = PP.FULL_FORM
        shortForm = PP.SHORT_FORM
        break

      case PL.SHORT_FORM.toLowerCase():
      case PL.FULL_FORM.toLowerCase():
      case PL.PACKING_MANIFEST.toLowerCase():
      case PL.PACKING_LIST.toLowerCase():
      case FOUR:
        docType = PL.FULL_FORM
        shortForm = PL.SHORT_FORM
        break
      default:
        docType = DOC.FULL_FORM
        shortForm = DOC.SHORT_FORM
        break
    }
    essentials[CUSTOMER][DOCUMENT_TYPE] = docType
    essentials[CUSTOMER][DOC_SHORT_FORM] = shortForm
  }
}