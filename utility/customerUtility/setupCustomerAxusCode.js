import fs from 'fs'
import CONSTANTS from '../../constants'
import moment from 'moment'
import isFileExisting from '../fileUtility/isFileExisting'
import {writeToFile} from '../fileUtility'

const {
  fields: {
    CUSTOMER,
    DOC_SHORT_FORM,
    JIRA_NUMBER,
    USER,
    USER_NAME,
    FILE,
    CUSTOMER_NAME,
    RULE_SET_TYPE,
    CUSTOMER_TEST_DIRECTORY,
    EVENT,
    MODULE_NAME
  },
  FILES: {
    EXTENSIONS: {
      SPEC
    }
  },
  GENERAL: {
    DATE_FORMAT,
    WHO,
    DESCRIPTION,
    ENCODING_UTF8
  },
  MESSAGES: {
    INFO: {
      AXUS_INITIAL_CODE_SETUP,
      NOT_MUCH_INFO,
      DATA_ALREADY_PRESENT
    },
  }
} = CONSTANTS


export default (essentials) => {
  return new Promise((resolve, reject) => {
    if (essentials && essentials[CUSTOMER][DOC_SHORT_FORM] && essentials[CUSTOMER][JIRA_NUMBER]) {
      let jiraNumber = essentials[CUSTOMER][JIRA_NUMBER]
      let date = `${moment().format(DATE_FORMAT)}`
      let who = `${essentials[USER][USER_NAME].charAt(0).toUpperCase()}${essentials[USER][USER_NAME].charAt(1).toUpperCase()}` || WHO
      let description = `${DESCRIPTION}`
      let code = constructCode(essentials, jiraNumber, date, who, description)
      isFileExisting(`${essentials[FILE][CUSTOMER_TEST_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][MODULE_NAME]}/`,`${essentials[CUSTOMER][RULE_SET_TYPE]}`,`${SPEC}`).then((res) => {
        let data = fs.readFileSync(`${essentials[FILE][CUSTOMER_TEST_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][MODULE_NAME]}/${essentials[CUSTOMER][RULE_SET_TYPE]}${SPEC}`, ENCODING_UTF8)
        if(data && data != ``){
          console.log(DATA_ALREADY_PRESENT)
          resolve()
        }else{
          writeToFile(`${essentials[FILE][CUSTOMER_TEST_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][MODULE_NAME]}`,`${essentials[CUSTOMER][RULE_SET_TYPE]}`, `${SPEC}`, code)
          // fs.writeFileSync(`${essentials[FILE][CUSTOMER_TEST_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][MODULE_NAME]}/${essentials[CUSTOMER][RULE_SET_TYPE]}${SPEC}`, code)
          console.log(`${AXUS_INITIAL_CODE_SETUP}`)
          resolve()
        }
      })
      .catch((res) => {
        fs.writeFileSync(`${essentials[FILE][CUSTOMER_TEST_DIRECTORY]}/${essentials[CUSTOMER][CUSTOMER_NAME]}/${essentials[CUSTOMER][MODULE_NAME]}/${essentials[CUSTOMER][RULE_SET_TYPE]}${SPEC}`, code)
        console.log(`${AXUS_INITIAL_CODE_SETUP}`)
        resolve()
      })
    } else {
      console.log(`${NOT_MUCH_INFO}`)
      resolve()
    }
  })
}


let constructCode = (essentials, jiraNumber, date, who, description) => {
  let eventType = `${essentials[CUSTOMER][EVENT]}`
  let sampleCode = `/**
*   C H A N G E    L  O G
*
*  (B)ug/(E)nh/(I)DB #    Date      Who  Description
*  -------------------  ----------  ---  ---------------------------------------------------------------
*	${jiraNumber}\t\t\t\t\t\t ${date} \t${who}\t${description}
*/
let chai = require('chai');
chai.use(require('chai-things'));
let expect = chai.expect;
let axus = require('axus');
let ctx = axus
.requireLocal('../customer/${essentials.customer.customerName}/${essentials.customer.moduleName}', undefined, {
  console: console
})
.seed(require('./resources/seed.json')); //ADD YOUR SEEDFILE HERE
describe('${essentials.customer.customerName} ${essentials.customer.ruleSetType}:', () => {
  beforeEach(() => {
    ctx.Providers.reset();
  });
let ${(essentials.customer.docShortForm)}_Sample_${essentials.customer.sampleRefNumber||""} = require('./resources/${essentials.customer.documentType}.json');
describe('${essentials.customer.ruleSetType}.1:', () => {
  it('Positive: ${essentials.customer.customerName} ', (done) => {
    //TODO
    ctx.fnOn${eventType}(${(essentials.customer.docShortForm)}_Sample_${essentials.customer.sampleRefNumber});
    done();
  });
});
});
      `
  return sampleCode.replace(/\n/g, '\r\n')
}