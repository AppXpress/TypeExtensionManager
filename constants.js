import readline from 'readline'

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

let essentials = {}
let writeOut = {}
let DOCUMENTS = ``

const configFile = `module`

const fields = {
    EXISTING: `existing`,
    CUSTOMER_DIRECTORY:`customerDirectory`,
    CUSTOMER_TEST_DIRECTORY: `customerTestDirectory`,
    CREDENTIALS: `credentials`,
    USER_NAME: `username`,
    PASSWORD: `password`,
    DATA_KEY: `dataKey`,
    CUSTOMER: `customer`,
    TEST: `test`,
    CUSTOMER_NAME: `customerName`,
    DOC_TYPE: `docType`,
    SHORT_FORM: `shortForm`,
    RULE_SET_TYPE: `ruleSetType`,
    CUSTOMER_PLATFORM_PATH: `customerPlatformPath`,
    CUSTOMER_PLATFORM_TEST_PATH: `customerPlantformTestPath`,
    DOCUMENT_TYPE: `documentType`,
    DOC_SHORT_FORM: 'docShortForm',
    JIRA_NUMBER: `jiraNumber`,
    PRESENT_WORKING_DIR: `pwd`,
    AUTHORIZATION: `Authorization`,
    OBJECT_FIELDS: `OBJECT_FIELDS`,
    EVENT: `Event`,
    IS_SAMPLE_REQUIRED: `isSampleRequired`,
    FILE: `file`,
    IS_CONFIG: `isConfig`,
    HTTP_HEADER:{
        headers:{
            Authorization: ``,
            dataKey: ``
        }
    },
    ENVIRONMENT: `environment`,
    SAMPLE_REF_NUMBER: `sampleRefNumber`,
    USER: `user`,
    QUERY_URL: `queryUrl`,
    FETCH_URL: `fetchUrl`,
    DOCUMENT_FETCH_URL:`FETCH_URL`,
    DOCUMENT_QUERY_URL: `QUERY_URL`,
    PO_NUMBERS_LIST: 'poNumbersList',
    SEED_QUERY_FIELD: `SEED_QUERY_FIELD`,
    ORDERS_FIELD: `ORDERS_FIELD`,
    QUERIED_OBJECTS: `queriedObjects`,
    FETCHED_OBJECTS: `fetchedObjects`,
    UID: `UID`,
    IS_WIN: `isWin`
}

const CMD_ARGUMENTS = {
    DOC_ARG: `doc`,
    TYPE_ARG: `type`,
    HELP_ARG: `--h`
}


const GENERAL = {
    ENCODING_UTF8: `utf8`,
    BASIC: `Basic`,
    BASE_64: `base64`,
    JIRA_PSO_HEADER: `PSO-`,
    JIRA_BUG_HEADER: `GTBUG-`,
    JIRA_DEFAULT_TEXT: `CHANGEME`,
    DATE_FORMAT: `MM/DD/YYYY`,
    WHO: `¯\\_(ツ)_/¯`,
    DESCRIPTION: `UPDATE THE DESCRIPTION`,
    AFFIRM: [`YES`, `Y`],
    NEGATIVE: [`NO`, `N`],
    GET: `get`,
    POST: `post`,
    SEED: `seed`
}

const GENERAL_GTNEXUS_OBJECTS = {
    RESULT: `result`,
    SHIPMENT_ITEM: `shipmentItem`,
    PO_NUMBER: `poNumber`,
    META_DATA: `__metadata`,
    UID: `uid`
}

const GTNEXUS = {
    ENVIRONMENT_URL:{
        SUPPORTQ: `network-supportq.qa`,
        PREPROD: `preprod`
    },
    API: {
        OQL: `oql`,
        QUERY: `query`,
        VERSION:{
            LATEST: `3.1`
        },
    },
    get SUPQ_URL() {
       return `https://${this.ENVIRONMENT_URL.SUPPORTQ}.gtnexus.com/rest/${this.API.VERSION.LATEST}`
    },
    get PREPROD_URL() {
        return `https://${this.ENVIRONMENT_URL.PREPROD}.gtnexus.com/rest/${this.API.VERSION.LATEST}`
    }
}

const FILES = {
    CURRENT: `./`,
    EXTENSIONS: {
        JS: `.js`,
        SPEC: `.spec.js`,
        _JSON: `.json`,
        INI: `.ini`
    },
    RESOURCES: `resources`,

}

const DOCTYPES = {
    PO:{
        PO:`Po`,
        PURCHASE_ORDER: `PurchaseOrder`,
        ORDER: `Order`,
        ORDER_DETAIL: `OrderDetail`,
        QUERY_FIELDS: {
            PO_NUMBER: `poNumber`
        },
        OBJECT_FIELDS:{
            ORDER_UID: `orderUid`
        },
        get FULL_FORM() {
            return this.PURCHASE_ORDER
        },
        get SHORT_FORM() {
            return this.PO.toUpperCase()
        },
        get QUERY_URL() {
            return `${this.ORDER_DETAIL}/${GTNEXUS.API.QUERY}?${GTNEXUS.API.OQL}=${this.QUERY_FIELDS.PO_NUMBER}=`
        },
        get FETCH_URL() {
            return `${this.ORDER_DETAIL}`
        },
        get SEED_QUERY_FIELD() {
            return `${this.QUERY_FIELDS.PO_NUMBER}=`
        },
        get UID() {
            return `${this.OBJECT_FIELDS.ORDER_UID}`
        }
    },
    INV:{
        INV: `Inv`,
        COMMERCIAL_INVOICE: `CommercialInvoice`,
        INVOICE: `Invoice`,
        INVOICE_DETAIL: `InvoiceDetail`,
        QUERY_FIELDS: {
            INVOICE_NUMBER: `invoiceNumber`
        },
        OBJECT_FIELDS:{
            INVOICE_UID: `invoiceUid`
        },
        ORDERS_FIELD: `orderReference`,
        get FULL_FORM() {
            return this.COMMERCIAL_INVOICE
        },
        get SHORT_FORM() {
            return this.INV.toUpperCase()
        },
        get QUERY_URL() {
            return `${this.INVOICE_DETAIL}/${GTNEXUS.API.QUERY}?${GTNEXUS.API.OQL}=${this.QUERY_FIELDS.INVOICE_NUMBER}=`
        },
        get FETCH_URL() {
            return `${this.INVOICE_DETAIL}`
        },
        get SEED_QUERY_FIELD() {
            return `${this.QUERY_FIELDS.INVOICE_NUMBER}=`
        },
        get UID() {
            return `${this.OBJECT_FIELDS.INVOICE_UID}`
        }
    },
    PL:{
        PL: `Pl`,
        PKM: `Pkm`,
        PACKING_MANIFEST: `PackingManifest`,
        PACKING_LIST: `PackingList`,
        PACKING_LIST_DETAIL: `PackingListDetail`,
        QUERY_FIELDS: {
            PACKING_LIST_NUMBER: `packingListNumber`
        },
        OBJECT_FIELDS:{
            PACKING_LIST_UID: `packingListUid`
        },
        ORDERS_FIELD: `shipmentItem`,
        get FULL_FORM() {
            return this.PACKING_MANIFEST
        },
        get SHORT_FORM() {
            return this.PL.toUpperCase()
        },
        get QUERY_URL() {
            return `${this.PACKING_LIST_DETAIL}/${GTNEXUS.API.QUERY}?${GTNEXUS.API.OQL}=${this.QUERY_FIELDS.PACKING_LIST_NUMBER}=`
        },
        get FETCH_URL() {
            return `${this.PACKING_LIST_DETAIL}`
        },
        get SEED_QUERY_FIELD() {
            return `${this.QUERY_FIELDS.PACKING_LIST_NUMBER}=`
        },
        get UID() {
            return `${this.OBJECT_FIELDS.PACKING_LIST_UID}`
        }
    },
    PP:{
        PP: `Pp`,
        PPM: `Ppm`,
        PACKING_PLAN_MANIFEST: `PackingPlanManifest`,
        PACKING_PLAN: `PackingPlan`,
        PACKING_PLAN_DETAIL: `PackingPlanDetail`,
        QUERY_FIELDS: {
            PACKING_PLAN_NUMBER: `packingPlanNumber`
        },
        OBJECT_FIELDS:{
            PACKING_PLAN_UID: `packingPlanUid`
        },
        ORDERS_FIELD: `shipmentItem`,
        get FULL_FORM() {
            return this.PACKING_PLAN_MANIFEST
        },
        get SHORT_FORM() {
            return this.PP.toUpperCase()
        },
        get QUERY_URL() {
            return `${this.PACKING_PLAN_DETAIL}/${GTNEXUS.API.QUERY}?${GTNEXUS.API.OQL}=${this.QUERY_FIELDS.PACKING_PLAN_NUMBER}=`
        },
        get FETCH_URL() {
            return `${this.PACKING_PLAN_DETAIL}`
        },
        get SEED_QUERY_FIELD() {
            return `${this.QUERY_FIELDS.PACKING_PLAN_NUMBER}=`
        },
        get UID() {
            return `${this.OBJECT_FIELDS.PACKING_PLAN_UID}`
        }
    },
    DOC:{
        DOC: `Doc`,
        DOCUMENT: `Document`,
        get FULL_FORM() {
            return this.DOCUMENT
        },
        get SHORT_FORM(){
            return this.DOC.toUpperCase()
        }
    }
}

const EVENTS = {
    POPULATION: `Population`,
    POPULATIONS: `Populations`,
    POP: `pop`,
    POPS: `Pops`,
    VALIDATION: `Validation`,
    VALIDATIONS: `Validations`,
    VLD: `Vld`,
    VLDS: `Vlds`,
    POPULATE: `Populate`,
    VALIDATE: `Validate`
}

const RULE_SET = {
    RULE_SET: `RuleSet`,
    get POP_RULE_SET() {
        return EVENTS.POPULATIONS + this.RULE_SET
    },
    get VLD_RULE_SET() {
        return EVENTS.VALIDATIONS + this.RULE_SET
    }
}

const OPTIONS = {
    ONE: `1`,
    TWO: `2`,
    THREE: `3`,
    FOUR: `4`,
    FIVE: `5`,
    SIX: `6`,
    SEVEN: `7`,
    EIGHT: `8`,
    NINE: `9`,
}

const QUESTIONS = {
    QUESTION_CUSTOMER_NAME: `Enter Customer Name: `,
    QUESTION_DOCUMENT_TYPE: `Document Type - \n1.${DOCTYPES.PO.SHORT_FORM}\n2.${DOCTYPES.INV.SHORT_FORM}\n3.${DOCTYPES.PP.SHORT_FORM}\n4.${DOCTYPES.PL.SHORT_FORM}\n5.Custom Document Name\nOPTION: `,
    QUESTION_RULESET_TYPE: `Type of ruleset:\n1.${EVENTS.POPULATION}\n2.${EVENTS.VALIDATION}\nOPTION: `,
    QUESTION_JIRA_NUMBER: `Add your JIRA#: `,
    QUESTION_SAMPLE_DATA_REQUEST: `Would you like me to fetch some sample data for you?[Y|N]: `,
    QUESTION_SAMPLE_DATA: `Provide your SampleRef#: `,
    QUESTION_PICK_ENV: `Which environment would you like to fetch the data from?\n1.SUPPORTQ\n2.PREPROD\nOPTION: `,
    QUESTION_SAMPLE_PO_DATA: `Do you want me to fetch all the realted PO Documents?[Y|N]: `,
    QUESTION_USER_CREDENTIALS: `Enter your SUPPORTQ Credentials(Need this to fetch data and create sample files for your module)\n`,
    QUESTION_USER_CREDENTIALS_USERNAME: `UserName:\n`,
    QUESTION_USER_CREDENTIALS_PASSWORD: `Password:`
}
const MESSAGES = {
    ERRORS:{
        NO_DOC_TYPE_PROVIDED: `Please provide the document type[${DOCTYPES.PO.SHORT_FORM}|${DOCTYPES.PL.SHORT_FORM}|${DOCTYPES.PP.SHORT_FORM}|${DOCTYPES.INV.SHORT_FORM}|Custom Document Name]`,
        NO_RULESET_TYPE_RPOVIDED: `Please provide the type of TypeExtension [${EVENTS.POPULATION}|${EVENTS.VALIDATION}]`,
        FILE_CREATION_ERROR: `FATAL: BAD ARGS for File`,
        FAILED_WRITING_FILE: `FATAL: Could not write to file`
    },
    INFO:{
        COULD_NOT_CREATE_AXUS_TEST_FILE: `Unfortunatly I could not create your Axus test file`,
        COULD_NOT_CREATE_TEST_FOLDER: `Unfortunatly I could not create your Test Folder`,
        TYPE_EXTENSION_INITIAL_CODE_SETUP: `I have set your intial Type Extension`,
        AXUS_INITIAL_CODE_SETUP: `I have set your intial Axus`,
        NOT_MUCH_INFO: `I do not have much info to create your file`,
        DATA_ALREADY_PRESENT: `Looks like you already have some code in there`,
        DID_NOT_FETCH_DATA: `Okay! I did not setup any sample data for you`,
        PICKED_ENV: `Okay so you picked `
    },
    HELP:{
        HELP_TEXT: `HELP INFO:\n|-> npm start --- Runs the tool\n|-> npm start doc <DOCUMENT_TYPE> type <RULESET_TYPE>\n\t|-> doc: Specifies your are providing a document type as your next argument\n\t|-> type: Specifies you are providing a ruleset type as your next argument\n|-> MORE INFO: https://wiki.gtnexus.info/display/PSO/Type+Extension+Manager`
    }
}

const STARTUP_LOG = {
    NAME: `Type Extension Manager`,
    VERSION: `v1.0`,
    BETA: `beta`,
    PATTERN: `*`,
    AUTHOR: `bhuvanesh.arasu@infor.com`,
    MENTOR: `stephen.bendfelt@infor.com`,
    get STARTUP_SCREEN () {
        const width = process.stdout.columns || 20
        let marginPattern = ``
        let i = 0
        for(i; i < width; i++){
            marginPattern+= this.PATTERN
        }
        const finalPattern = `${marginPattern}\n\t${this.NAME} -- ${this.VERSION} ${this.BETA} \t${this.AUTHOR}\t${this.MENTOR}\n${marginPattern}`
        return finalPattern
    }
}



export default{
    essentials,
    writeOut,
    rl,
    DOCUMENTS,
    DOCTYPES,
    RULE_SET,
    GTNEXUS,
    configFile,
    FILES,
    GENERAL,
    QUESTIONS,
    MESSAGES,
    EVENTS,
    GENERAL_GTNEXUS_OBJECTS,
    OPTIONS,
    fields,
    CMD_ARGUMENTS,
    STARTUP_LOG
}