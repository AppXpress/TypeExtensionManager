import shell from 'shelljs'
import CONSTANTS from '../../constants'

const {MESSAGES:{ERRORS:{FILE_CREATION_ERROR}}} = CONSTANTS

export default (path, fileName, fileExtension) => {
    return new Promise((resolve, reject) => {
        if(path && fileExtension && fileName){
            try{
                console.log(`${path}/${fileName}${fileExtension}`)
                shell.touch(`${path}/${fileName}${fileExtension}`)
                resolve(`${path}/${fileName}${fileExtension} sucessfully created`)
            }catch(fe){
                resolve(`${path}/${fileName}${fileExtension} is likely existing`)
            }
        }else{
            reject(`${FILE_CREATION_ERROR}`)
        }
    })
}
