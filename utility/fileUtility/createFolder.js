import CONSTANTS from '../../constants'
import shell from 'shelljs'
import node_path from 'upath'

const {MESSAGES:{ERRORS:{FILE_CREATION_ERROR}}} = CONSTANTS

export default (path) => {
    return new Promise((resolve, reject) => {
        if(path){
            try {
                const absolutePath = node_path.toUnix(`${path}`)
                if(shell.mkdir('-p', `${absolutePath}`).code == 0){
                    resolve(`${path} sucessfully created`)
                }
            } catch (error) {
                reject(`${FILE_CREATION_ERROR}`)
            }
        }else{
            reject(`${FILE_CREATION_ERROR}`)
        }
    })
}
