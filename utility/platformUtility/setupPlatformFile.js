import xmljsonParser from 'xml-js'
import CONSTANTS from '../../constants'
import moment from 'moment'
import fs from 'fs'
import {isFileExisting} from "../fileUtility";


const {
    fields: {
        CUSTOMER,
        DOCUMENT_TYPE,
        RANK,
        EVENT,
        ADD_PLATFORM_FILE,
        PLATFORM_FILE,
        MODULE_PATH,
        MODULE_NAME,
        CUSTOMER_NAME
    },
    GENERAL:{
        FULL_DATE_FORMAT
    },
    PLATFORM:{
        FILES,
        FILES:{
            PLATFORM_MODULE,
            METADATA_PROPERTIES
        },
        FOLDERS:{
            $TYPE_EXTENSION_D1,
            PLATFORM_LOCALIZATION
        }
    },
    FILES:{
        EXTENSIONS:{
            XML,
            PROPERTIES
        }
    },
    GTNEXUS: {
        API: {
            VERSION: {
                FULL_VERSION,
                LATEST
            }
        }
    }
} = CONSTANTS

export default (essentials) => {
    return new Promise((resolve, reject) => {
        setupPlatformModuleFile(essentials)
        setupMetaPropertiesFile(essentials)
        setupPlatformLocalizationMetaProperties(essentials)
        if (essentials[CUSTOMER][ADD_PLATFORM_FILE]) {
            let platformData = `
            {
              "elements": [
                {
                  "type": "element",
                  "name": "TYPEEXTENSIOND1",
                  "elements": [
                    {
                      "type": "element",
                      "name": "__metadata",
                      "elements": [
                        {
                          "type": "element",
                          "name": "apiVersion",
                          "elements": [
                            {
                              "type": "text",
                              "text": "${LATEST}"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "type",
                          "elements": [
                            {
                              "type": "text",
                              "text": "$TypeExtensionD1"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "uid",
                          "elements": [
                            {
                              "type": "text",
                              "text": ""
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "createTimestamp",
                          "elements": [
                            {
                              "type": "text",
                              "text": "${moment().format(FULL_DATE_FORMAT)}"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "modifyTimestamp",
                          "elements": [
                            {
                              "type": "text",
                              "text": "${moment().format(FULL_DATE_FORMAT)}"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "status",
                          "elements": [
                            {
                              "type": "text",
                              "text": "Active"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "userModRev",
                          "elements": [
                            {
                              "type": "text",
                              "text": "1"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "creatorId",
                          "elements": [
                            {
                              "type": "text",
                              "text": "-1"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "fingerprint",
                          "elements": [
                            {
                              "type": "text",
                              "text": ""
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "redirectUrl",
                          "elements": [
                            {
                              "type": "text",
                              "text": ""
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "self",
                          "elements": [
                            {
                              "type": "text",
                              "text": ""
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "element",
                      "name": "type",
                      "elements": [
                        {
                          "type": "text",
                          "text": "$TypeExtensionD1"
                        }
                      ]
                    },
                    {
                      "type": "element",
                      "name": "platformModuleType",
                      "elements": [
                        {
                          "type": "text",
                          "text": "PlatformModule"
                        }
                      ]
                    },
                    {
                      "type": "element",
                      "name": "documentType",
                      "elements": [
                        {
                          "type": "text",
                          "text": "${essentials[CUSTOMER][DOCUMENT_TYPE]}"
                        }
                      ]
                    },
                    {
                      "type": "element",
                      "name": "apiVersion",
                      "elements": [
                        {
                          "type": "text",
                          "text": "${FULL_VERSION}"
                        }
                      ]
                    },
                    {
                      "type": "element",
                      "name": "status",
                      "elements": [
                        {
                          "type": "text",
                          "text": "Active"
                        }
                      ]
                    },
                    {
                      "type": "element",
                      "name": "rank",
                      "elements": [
                        {
                          "type": "text",
                          "text": "${essentials[CUSTOMER][RANK]}"
                        }
                      ]
                    },
                    {
                      "type": "element",
                      "name": "callbacks",
                      "elements": [
                        {
                          "type": "element",
                          "name": "uid",
                          "elements": [
                            {
                              "type": "text",
                              "text": ""
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "event",
                          "elements": [
                            {
                              "type": "text",
                              "text": "on${essentials[CUSTOMER][EVENT] === "Populate"?"Save":essentials[CUSTOMER][EVENT]}"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "role",
                          "elements": [
                            {
                              "type": "text",
                              "text": "Buyer"
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "functionName",
                          "elements": [
                            {
                              "type": "text",
                              "text": "fnOn${essentials[CUSTOMER][EVENT]}"
                            }
                          ]
                        }
                      ]
                    },
                    {
                      "type": "element",
                      "name": "fingerprint",
                      "elements": [
                        {
                          "type": "text",
                          "text": ""
                        }
                      ]
                    }
                  ]
                }
              ]
            }
            `
            let options = {compact: false, ignoreComment: true, spaces: 4};
            try {
                let result = xmljsonParser.json2xml(JSON.parse(platformData), options);
                essentials[CUSTOMER][PLATFORM_FILE] = result
                fs.writeFileSync(`${essentials[CUSTOMER][MODULE_PATH]}/${$TYPE_EXTENSION_D1}/${FILES.GET_FILE_NAME}${XML}`, essentials[CUSTOMER][PLATFORM_FILE])
                resolve()
            } catch (parseError) {
                reject()
            }
        } else {
            resolve()
        }

    })
}

let setupMetaPropertiesFile = (essentials) => {
    let boolMetaProperties = fs.existsSync(`${essentials[CUSTOMER][MODULE_PATH]}/${METADATA_PROPERTIES}${PROPERTIES}`)
    let metaProperties = `environment.name=
source.id=
source.type=${PLATFORM_MODULE}
source.revision=
data.format=v100
export.timestamp=
name=${essentials[CUSTOMER][MODULE_NAME]}
ownerId=
            `
    if(boolMetaProperties){
        let metaPropertiesData = fs.readFileSync(`${essentials[CUSTOMER][MODULE_PATH]}/${METADATA_PROPERTIES}${PROPERTIES}`)
        if(metaPropertiesData.length === 0){

            fs.writeFileSync(`${essentials[CUSTOMER][MODULE_PATH]}/${METADATA_PROPERTIES}${PROPERTIES}`, metaProperties)
        }
    }else{
        fs.writeFileSync(`${essentials[CUSTOMER][MODULE_PATH]}/${METADATA_PROPERTIES}${PROPERTIES}`, metaProperties)
    }
}

let setupPlatformLocalizationMetaProperties = (essentials) => {
    let boolMetaProperties = fs.existsSync(`${essentials[CUSTOMER][MODULE_PATH]}/${PLATFORM_LOCALIZATION}/${METADATA_PROPERTIES}${PROPERTIES}`)
    let metaProperties = `environment.name=
source.id=
source.type=${PLATFORM_LOCALIZATION}
source.revision=
data.format=v100
export.timestamp=
            `
    if(boolMetaProperties){
        let metaPropertiesData = fs.readFileSync(`${essentials[CUSTOMER][MODULE_PATH]}/${PLATFORM_LOCALIZATION}/${METADATA_PROPERTIES}${PROPERTIES}`)
        if(metaPropertiesData.length === 0){

            fs.writeFileSync(`${essentials[CUSTOMER][MODULE_PATH]}/${PLATFORM_LOCALIZATION}/${METADATA_PROPERTIES}${PROPERTIES}`, metaProperties)
        }
    }else{
        fs.writeFileSync(`${essentials[CUSTOMER][MODULE_PATH]}/${PLATFORM_LOCALIZATION}/${METADATA_PROPERTIES}${PROPERTIES}`, metaProperties)
    }
}

let setupPlatformModuleFile = (essentials) =>{
        // const boolIsExisting = await isFileExisting(`${essentials[CUSTOMER][MODULE_PATH]}`,`${PLATFORM_MODULE}`, `${XML}`)
        const boolIsExisting = fs.existsSync(`${essentials[CUSTOMER][MODULE_PATH]}/${PLATFORM_MODULE}${XML}`)
        let isDataExisting = false
        let platformModuleFile = `
            {
  "elements": [
    {
      "type": "element",
      "name": "PlatformModule400",
      "elements": [
        {
          "type": "element",
          "name": "__metadata",
          "elements": [
            {
              "type": "element",
              "name": "apiVersion",
              "elements": [
                {
                  "type": "text",
                  "text": "3.1"
                }
              ]
            },
            {
              "type": "element",
              "name": "type",
              "elements": [
                {
                  "type": "text",
                  "text": "PlatformModule"
                }
              ]
            },
            {
              "type": "element",
              "name": "uid",
              "elements": [
                {
                  "type": "text",
                  "text": ""
                }
              ]
            },
            {
              "type": "element",
              "name": "createTimestamp",
              "elements": [
                {
                  "type": "text",
                  "text": "${moment().format(FULL_DATE_FORMAT)}"
                }
              ]
            },
            {
              "type": "element",
              "name": "modifyTimestamp",
              "elements": [
                {
                  "type": "text",
                  "text": "${moment().format(FULL_DATE_FORMAT)}"
                }
              ]
            },
            {
              "type": "element",
              "name": "status",
              "elements": [
                {
                  "type": "text",
                  "text": "Active"
                }
              ]
            },
            {
              "type": "element",
              "name": "fingerprint",
              "elements": [
                {
                  "type": "text",
                  "text": ""
                }
              ]
            },
            {
              "type": "element",
              "name": "self",
              "elements": [
                {
                  "type": "text",
                  "text": ""
                }
              ]
            }
          ]
        },
        {
          "type": "element",
          "name": "moduleId",
          "elements": [
            {
              "type": "text",
              "text": ""
            }
          ]
        },
        {
          "type": "element",
          "name": "createTimestamp",
          "elements": [
            {
              "type": "text",
              "text": "${moment().format(FULL_DATE_FORMAT)}"
            }
          ]
        },
        {
          "type": "element",
          "name": "modifyTimestamp",
          "elements": [
            {
              "type": "text",
              "text": "${moment().format(FULL_DATE_FORMAT)}"
            }
          ]
        },
        {
          "type": "element",
          "name": "authorId",
          "elements": [
            {
              "type": "text",
              "text": ""
            }
          ]
        },
        {
          "type": "element",
          "name": "authorType",
          "elements": [
            {
              "type": "text",
              "text": "Organization"
            }
          ]
        },
        {
          "type": "element",
          "name": "ownerId",
          "elements": [
            {
              "type": "text",
              "text": ""
            }
          ]
        },
        {
          "type": "element",
          "name": "ownerType",
          "elements": [
            {
              "type": "text",
              "text": "TradeCustomer"
            }
          ]
        },
        {
          "type": "element",
          "name": "name",
          "elements": [
            {
              "type": "text",
              "text": "${essentials[CUSTOMER][MODULE_NAME]}"
            }
          ]
        },
        {
          "type": "element",
          "name": "description",
          "elements": [
            {
              "type": "text",
              "text": "${essentials[CUSTOMER][CUSTOMER_NAME]} ${essentials[CUSTOMER][DOCUMENT_TYPE]} TypeExtension Module"
            }
          ]
        },
        {
          "type": "element",
          "name": "userVersion",
          "elements": [
            {
              "type": "text",
              "text": "1.0"
            }
          ]
        }
      ]
    }
  ]
}
        `
        if(boolIsExisting){
            const data = fs.readFileSync(`${essentials[CUSTOMER][MODULE_PATH]}/${PLATFORM_MODULE}${XML}`, 'utf8')
            if(data.length === 0){
                isDataExisting = false
            }else{
                isDataExisting = true
            }
        }else{
            isDataExisting = false
        }
        if(isDataExisting){
            return
        }else{
            let options = {compact: false, ignoreComment: true, spaces: 4};
            try {
                let result = xmljsonParser.json2xml(JSON.parse(platformModuleFile), options);
                fs.writeFileSync(`${essentials[CUSTOMER][MODULE_PATH]}/${PLATFORM_MODULE}${XML}`, result)
            } catch (parseError) {

            }
        }
}