import xmljsonParser from 'xml-js'
import CONSTANTS from '../../constants'
import fs from 'fs'


const {
    fields: {
        CUSTOMER,
        DOCUMENT_TYPE,
        RANK,
        EVENT,
        ADD_PLATFORM_FILE,
        PLATFORM_FILE,
        MODULE_PATH
    },
    PLATFORM:{
        FILES,
        FOLDERS:{
            $TYPE_EXTENSION_D1
        }
    },
    FILES:{
        EXTENSIONS:{
            XML
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
                              "text": ""
                            }
                          ]
                        },
                        {
                          "type": "element",
                          "name": "modifyTimestamp",
                          "elements": [
                            {
                              "type": "text",
                              "text": ""
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
                              "text": "on${essentials[CUSTOMER][EVENT]}"
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