import fs from 'fs'
import CONSTANTS from '../../constants'
import shell from 'shelljs'
const {MESSAGES:{ERRORS:{FILE_CREATION_ERROR}}} = CONSTANTS

export default (path, fileName) => {
    return new Promise((resolve, reject) => {
        if(path && fileName){
            try {
                shell.mkdir('-p', `${path}/${fileName}`)
                resolve(`${path}/${fileName} sucessfully created`)
            } catch (error) {
                reject(`${FILE_CREATION_ERROR}`)
            }
        }else{
            reject(`${FILE_CREATION_ERROR}`)
        }
    })
}
