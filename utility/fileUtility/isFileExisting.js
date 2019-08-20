import fs from 'fs'

export default (path, fileName, fileExtension) => {
    return new Promise((resolve, reject) => {
        if(path && fileExtension && fileName){
            try{
                let data = fs.readFileSync(`${path}/${fileName}.${fileExtension}`, 'utf8')
                if(data){
                    resolve(true)
                }else{
                    reject(false)
                }
            }catch(fe){
                reject(false)                
            }
        }
    })
}