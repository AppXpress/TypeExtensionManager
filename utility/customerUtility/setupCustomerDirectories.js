import CONSTANTS from '../../constants'
import {
  createFolder
} from '../fileUtility'
const {
  MESSAGES: {
    INFO: {
      COULD_NOT_CREATE_TEST_FOLDER
    }
  },
  fields: {
    CUSTOMER,
    RULE_SET_TYPE,
    CUSTOMER_NAME,
    FILE,
    CUSTOMER_DIRECTORY,
    CUSTOMER_TEST_DIRECTORY,
    MODULE_NAME
  },
  FILES: {
    RESOURCES
  }
} = CONSTANTS



export default (essential) => {
  return new Promise((resolve, reject) => {
    if (essential[CUSTOMER] && essential[CUSTOMER][CUSTOMER_NAME]) {
      const customerName = essential[CUSTOMER][CUSTOMER_NAME]
      createFolder(`${essential[FILE][CUSTOMER_DIRECTORY]}/${customerName}/${essential[CUSTOMER][MODULE_NAME]}`)
        .then((customerFolderCreationStauts) => {
          createFolder(`${essential[FILE][CUSTOMER_TEST_DIRECTORY]}/${customerName}/${essential[CUSTOMER][MODULE_NAME]}`)
            .then(() => {
              createFolder(`${essential[FILE][CUSTOMER_TEST_DIRECTORY]}/${customerName}/${essential[CUSTOMER][MODULE_NAME]}/${RESOURCES}`).then((status) => {
                resolve()
              })
            })
            .catch(() => {
              console.log(COULD_NOT_CREATE_TEST_FOLDER)
              resolve()
            })
          console.log(customerFolderCreationStauts)
        })
        .catch((customerFolderCreationStauts) => {
          console.log(customerFolderCreationStauts)
          resolve()
        })
    } else {
      reject(new Error(status))
    }
  })
}