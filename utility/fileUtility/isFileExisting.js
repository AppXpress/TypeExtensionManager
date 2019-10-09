import fs from 'fs'

export default (path, fileName, fileExtension) => {
    return new Promise((resolve, reject) => {
        if(path && fileExtension && fileName){
            try{
                const isFileExisting = fs.existsSync(`${path}/${fileName}${fileExtension}`)
                if(isFileExisting){
                    let data = fs.readFileSync(`${path}/${fileName}${fileExtension}`, 'utf8')
                    if(data){
                        resolve(true)
                    }else if(data.length === 0){
                        resolve(true)
                    }else{
                        console.log(data)
                        resolve(false)
                    }
                }else{
                    resolve(false)
                }
            }catch(fe){
                reject(false)
            }
        }else{
            resolve(false)
        }
    })
}