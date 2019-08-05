import fs from 'fs'

export default (path, fileName, fileExtension) => {
    return new Promise((resolve, reject) => {
        if(path && fileExtension && fileName){
            try{
                fs.readFileSync(`${path}/${fileName}.${fileExtension}`)
                resolve()
            }catch(fe){
                fs.writeFileSync(`${path}/${fileName}.${fileExtension}`,``)
                resolve(`${fileName} sucessfully created`)
            }
        }else{
            reject(`FATAL: BAD ARGS for File`)
        }
    })
}
