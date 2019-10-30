import fs from 'fs'
import CONSTANTS from '../../constants'
import node_path from 'path'
let {GENERAL:{ENCODING_UTF8}} = CONSTANTS

export default (path, fileName, fileExtension, data) => {
    console.log(data)
    return new Promise((resolve, reject) => {
        if(path && fileExtension && fileName && data){
            const absolutePath = node_path.resolve(`${path}`, `${fileName}${fileExtension}`)
            console.log(`${absolutePath}`)
            try{
                fs.writeFileSync(`${absolutePath}`, data)
                resolve()
            }catch (e) {
                reject(`FATAL: Could not write data to file`)
            }
        }
    })
}