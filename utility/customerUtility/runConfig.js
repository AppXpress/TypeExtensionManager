import CONSTANTS from '../../constants';
const {
  fields: {
    CUSTOMER,
    RULE_SET_TYPE,
    IS_CONFIG,
    CUSTOMER_NAME,
    DOCUMENT_TYPE,
    JIRA_NUMBER,
    SAMPLE_REF_NUMBER,
    IS_SAMPLE_REQUIRED,
  },
} = CONSTANTS


export default (essential, documentType, rulesetType) => {
  let ARR_DOCUMENT_TYPE = ["PO", "INV", "PP", "PL"]
  let ARR_RULE_SET_TYPE = ["POP", "VLD"]
  return new Promise((resolve, reject) => {
    console.log(documentType + " " + rulesetType)
    if (ARR_DOCUMENT_TYPE.includes(documentType.toUpperCase()) && ARR_RULE_SET_TYPE.includes(rulesetType.toUpperCase())) {
      let configFileType = documentType + `_` + rulesetType
      let config = require('../../configs/' + configFileType.toLowerCase() + '.json')
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