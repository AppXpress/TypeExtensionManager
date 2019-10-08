import CONSTANTS from '../../constants'

const {
  rl,
  QUESTIONS: {
    QUESTION_RULESET_TYPE
  },
  EVENTS: {
    POP,
    POPS,
    POPULATION,
    POPULATIONS,
    VALIDATION,
    VALIDATIONS,
    VLD,
    VLDS,
    POPULATE,
    VALIDATE
  },
  MESSAGES: {
    ERRORS: {
      NO_RULESET_TYPE_RPOVIDED
    }
  },
  fields: {
    CUSTOMER,
    RULE_SET_TYPE,
    CUSTOMER_NAME,
    DOCUMENT_TYPE,
    EVENT,
    IS_CONFIG
  },
  RULE_SET: {
    POP_RULE_SET,
    VLD_RULE_SET
  },
  OPTIONS: {
    ONE,
    TWO
  }
} = CONSTANTS

export default (essentials) => {
  return new Promise((resolve, reject) => {
    if (essentials[IS_CONFIG]) {
      settingRulesetType(essentials[CUSTOMER][RULE_SET_TYPE], essentials)
      resolve()
    } else {
      rl.question(`${QUESTION_RULESET_TYPE}`, (rulesetName) => {
        if (rulesetName) {
          settingRulesetType(rulesetName, essentials)
          resolve()
        } else {
          reject(new Error(NO_RULESET_TYPE_RPOVIDED))
        }
      })
    }
  })
}


let settingRulesetType = (rulesetName, essentials) => {
  let type = null
  let event = null
  switch (rulesetName.toLowerCase()) {
    case POP.toLowerCase():
    case POPS.toLowerCase():
    case POPULATION.toLowerCase():
    case POPULATIONS.toLowerCase():
    case ONE:
      type = essentials[CUSTOMER][CUSTOMER_NAME] + essentials[CUSTOMER][DOCUMENT_TYPE] + POP_RULE_SET
      event = POPULATE
      break

    case VLD.toLowerCase():
    case VLDS.toLowerCase():
    case VALIDATION.toLowerCase():
    case VALIDATIONS.toLowerCase():
    case TWO:
      type = essentials[CUSTOMER][CUSTOMER_NAME] + essentials[CUSTOMER][DOCUMENT_TYPE] + VLD_RULE_SET
      event = VALIDATE
      break
    default:
      reject(new Error(NO_RULESET_TYPE_RPOVIDED))
      break
  }
  essentials[CUSTOMER][RULE_SET_TYPE] = type
  essentials[CUSTOMER][EVENT] = event
}