import fs from 'fs'
import CONSTANTS from '../../constants'

let {GENERAL:{ENCODING_UTF8}} = CONSTANTS

export default (path, fileName, fileExtension, data) => {
    return new Promise((resolve, reject) => {
        if(path && fileExtension && fileName && data){
            fs.writeFile(`${path}/${fileName}${fileExtension}`, JSON.stringify(data), ENCODING_UTF8, (err) => {
                if(err){
                    reject(`FATAL: Could not write data to file`)
                }else{
                    resolve()
                }
            })
        }
    })
}