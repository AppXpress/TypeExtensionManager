import CONSTANTS from '../../constants'

const {
    rl,
    QUESTIONS:{QUESTION_JIRA_NUMBER},
    fields:{CUSTOMER, JIRA_NUMBER},
    GENERAL:{JIRA_PSO_HEADER,JIRA_DEFAULT_TEXT}
} = CONSTANTS

export default (essentials) => {
    return new Promise((resolve, reject) => {
        rl.question(`${QUESTION_JIRA_NUMBER}`, (jiraNumber) => {
            let formatedJiraNumber = null
            if(jiraNumber && jiraNumber != ``){
                if(jiraNumber.includes(`${JIRA_PSO_HEADER}`)){
                    formatedJiraNumber = jiraNumber                                        
                }else{
                    formatedJiraNumber = `${JIRA_PSO_HEADER}${jiraNumber}`
                }
            }else{
                formatedJiraNumber = `${JIRA_PSO_HEADER}${JIRA_DEFAULT_TEXT}`
            }
            essentials[CUSTOMER][JIRA_NUMBER] = formatedJiraNumber
            resolve()
        })
    })
}