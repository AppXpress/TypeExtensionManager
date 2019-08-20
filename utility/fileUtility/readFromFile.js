import fs from 'fs'
import CONSTANTS from '../../constants'

let {GENERAL:{ENCODING_UTF8}} = CONSTANTS

export default (path, fileName, fileExtension) => {
    return new Promise((resolve, reject) => {
        if(path && fileExtension && fileName){
            try{
                resolve(fs.readFileSync(`${path}/${fileName}.${fileExtension}`, ENCODING_UTF8))
            }catch(fe){
                reject()
            }
        }
    })
}