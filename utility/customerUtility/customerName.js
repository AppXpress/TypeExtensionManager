import CONSTANTS from '../../constants'
let {
    fields:{CUSTOMER, CUSTOMER_NAME},
    rl
}= CONSTANTS
export default  (essentials)=>{
    return new Promise((resolve, reject) => {
      rl.question(`Enter Customer Name:`, (customerName) => {
        if(customerName){
            essentials[CUSTOMER] = {}
            essentials[CUSTOMER][CUSTOMER_NAME] = customerName      
            resolve();
        }else{
            reject();
        }  
      })
    })
  }

