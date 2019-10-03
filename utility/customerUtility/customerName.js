/**
 * 
 */

import CONSTANTS from '../../constants'
let {
    fields:{CUSTOMER, CUSTOMER_NAME, IS_CONFIG},
    rl
}= CONSTANTS
export default  (essentials)=>{
    return new Promise((resolve, reject) => {
      if(essentials[IS_CONFIG]){
        resolve()
      }else{
        rl.question(`Enter Customer Name:`, (customerName) => {
          if(customerName){
              essentials[CUSTOMER] = {}
              essentials[CUSTOMER][CUSTOMER_NAME] = customerName      
              resolve();
          }else{
              reject();
          }  
        })
      }
    })
  }

