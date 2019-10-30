import fs from 'fs'
import node_path from 'path'

export default (path, fileName, fileExtension) => {
    return new Promise((resolve, reject) => {
        if(path && fileExtension && fileName){
            try{
                const absoultePath = node_path.resolve(`${path}`, `${fileName}${fileExtension}`)
                const isFileExisting = fs.existsSync(`${absoultePath}`)
                if(isFileExisting){
                    let data = fs.readFileSync(`${absoultePath}`, 'utf8')
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