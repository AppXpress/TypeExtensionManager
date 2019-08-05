import fs from 'fs'

export default (path, fileName, fileExtension) => {
    return new Promise((resolve, reject) => {
        if(path && fileExtension && fileName){
            fs.readFile(`${path}/${fileName}.${fileExtension}`, (err, data) => {
                if(err){
                    reject(false)
                }else{
                    if(data != ``){
                        resolve(true)
                    }
                }
            })
        }
    })
}