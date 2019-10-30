import shell from 'shelljs'
import CONSTANTS from '../../constants'
import node_path from 'path'

const {MESSAGES:{ERRORS:{FILE_CREATION_ERROR}}} = CONSTANTS

export default (path, fileName, fileExtension) => {
    return new Promise((resolve, reject) => {
        if(path && fileExtension && fileName){
            try{
                const filePath = node_path.resolve(`${path}`,`${fileName}${fileExtension}`)
                shell.touch(`${filePath}`)
                resolve(`${filePath} sucessfully created`)
            }catch(fe){
                resolve(`${filePath} is likely existing`)
            }
        }else{
            reject(`${FILE_CREATION_ERROR}`)
        }
    })
}
