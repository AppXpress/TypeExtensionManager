import fs from 'fs'
import CONSTANTS from '../../constants'

const {MESSAGES:{ERRORS:{FILE_CREATION_ERROR}}} = CONSTANTS

export default (path, fileName, fileExtension) => {
    return new Promise((resolve, reject) => {
        if(path && fileExtension && fileName){
            try{
                fs.readFileSync(`${path}/${fileName}${fileExtension}`)
                resolve(`${fileName} is Existing`)
            }catch(fe){
                if(!fs.existsSync(path)){
                    fs.mkdirSync(path)
                }
                fs.writeFileSync(`${path}/${fileName}${fileExtension}`,``)
                resolve(`${fileName} sucessfully created`)
            }
        }else{
            reject(`${FILE_CREATION_ERROR}`)
        }
    })
}
