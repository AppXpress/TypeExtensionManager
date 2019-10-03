import CONSTANTS from '../../constants'

const {
  rl,
  QUESTIONS: {
    QUESTION_JIRA_NUMBER
  },
  fields: {
    CUSTOMER,
    JIRA_NUMBER,
    IS_CONFIG
  },
  GENERAL: {
    JIRA_PSO_HEADER,
    JIRA_DEFAULT_TEXT
  }
} = CONSTANTS

export default (essentials) => {
  return new Promise((resolve, reject) => {
    if (essentials[IS_CONFIG]) {
      settingJIRANumber(essentials, essentials[CUSTOMER][JIRA_NUMBER])
      resolve()
    } else {
      rl.question(`${QUESTION_JIRA_NUMBER}`, (jiraNumber) => {
        settingJIRANumber(essentials, jiraNumber)
        resolve()
      })
    }
  })
}

let settingJIRANumber = (essentials, jiraNumber) => {
  let formatedJiraNumber = null
  if (jiraNumber && jiraNumber != ``) {
    if (jiraNumber.includes(`${JIRA_PSO_HEADER}`)) {
      formatedJiraNumber = jiraNumber
    } else {
      formatedJiraNumber = `${JIRA_PSO_HEADER}${jiraNumber}`
    }
  } else {
    formatedJiraNumber = `${JIRA_PSO_HEADER}${JIRA_DEFAULT_TEXT}`
  }
  essentials[CUSTOMER][JIRA_NUMBER] = formatedJiraNumber
}