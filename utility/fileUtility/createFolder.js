import CONSTANTS from '../../constants'
import shell from 'shelljs'
import node_path from 'upath'

const {MESSAGES:{ERRORS:{FILE_CREATION_ERROR}}} = CONSTANTS

export default (path, fileName) => {
    return new Promise((resolve, reject) => {
        if(path && fileName){
            try {
                const absolutePath = node_path.toUnix(`${path}`, `${fileName}`)
                shell.mkdir('-p', `${absolutePath}`)
                resolve(`${path}${fileName} sucessfully created`)
            } catch (error) {
                reject(`${FILE_CREATION_ERROR}`)
            }
        }else{
            reject(`${FILE_CREATION_ERROR}`)
        }
    })
}
