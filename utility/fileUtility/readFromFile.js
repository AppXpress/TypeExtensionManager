import fs from 'fs'
import CONSTANTS from '../../constants'
import node_path from 'path'

let {GENERAL:{ENCODING_UTF8}} = CONSTANTS

export default (path, fileName, fileExtension) => {
    return new Promise((resolve, reject) => {
        if(path && fileExtension && fileName){
            try{
                const absolutePath = node_path.resolve(`${path}`, `${fileName}.${fileExtension}`)
                resolve(fs.readFileSync(`${absolutePath}`, ENCODING_UTF8))
            }catch(fe){
                reject()
            }
        }
    })
}