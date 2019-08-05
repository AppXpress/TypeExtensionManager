import fs from 'fs'
import CONSTANTS from '../../constants'

let {GENERAL:{ENCODING_UTF8}} = CONSTANTS

export default (path, fileName, fileExtension) => {
    return new Promise((resolve, reject) => {
        if(path && fileExtension && fileName){
            fs.readFile(`${path}/${fileName}.${fileExtension}`, ENCODING_UTF8, (err, data) => {
                if(err){
                    reject(null)
                }else{
                    if(data != ``){
                        resolve(data)
                    }
                }
            })
        }
    })
}