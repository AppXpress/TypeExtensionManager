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
    FILE: `file`,
    HTTP_HEADER:{
        headers:{
            Authorization: ``,
            dataKey: ``
        }
    },
    ENVIRONMENT: `environment`,
    SAMPLE_REF_NUMBER: `sampleRefNumber`,
    USER: `user`
}


const GENERAL = {
    ENCODING_UTF8: `utf8`,
    BASIC: `Basic`,
    BASE_64: `base64`
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
        JSON: `.json`,
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
        }
    },
    PL:{
        PL: `Pl`,
        PKM: `Pkm`,
        PACKING_MANIFEST: `PackingManifest`,
        PACKING_LIST: `PackingList`,
        PACKING_LIST_DETAIL: `PackingListDetail`,
        get FULL_FORM() {
            return this.PACKING_MANIFEST
        },
        get SHORT_FORM() {
            return this.PL.toUpperCase()
        },
        get FETCH_URL() {
            return `${this.PACKING_LIST_DETAIL}`
        }
    },
    PP:{
        PP: `Pp`,
        PPM: `Ppm`,
        PACKING_PLAN_MANIFEST: `PackingPlanManifest`,
        PACKING_PLAN: `PackingPlan`,
        PACKING_PLAN_DETAIL: `PackingPlanDetail`,
        get FULL_FORM() {
            return this.PACKING_PLAN_MANIFEST
        },
        get SHORT_FORM() {
            return this.PP.toUpperCase()
        },
        get FETCH_URL() {
            return `${this.PACKING_PLAN_DETAIL}`
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
    VLDS: `Vlds`
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

const QUESTIONS = {
    QUESTION_DOCUMENT_TYPE: `Document Type - ${DOCTYPES.PO.SHORT_FORM}|${DOCTYPES.PL.SHORT_FORM}|${DOCTYPES.PP.SHORT_FORM}|${DOCTYPES.INV.SHORT_FORM}|Custom Document Name:`,
    QUESTION_RULESET_TYPE: `Type of ruleset:(${EVENTS.VALIDATION}|${EVENTS.POPULATION}) - ${EVENTS.POP},${EVENTS.VLD},${EVENTS.POPS},${EVENTS.VLDS},${EVENTS.POPULATIONS},${EVENTS.VALIDATIONS} ?`
}
const MESSAGES = {
    ERRORS:{
        NO_DOC_TYPE_PROVIDED: `Please provide the document type[${DOCTYPES.PO.SHORT_FORM}|${DOCTYPES.PL.SHORT_FORM}|${DOCTYPES.PP.SHORT_FORM}|${DOCTYPES.INV.SHORT_FORM}|Custom Document Name]`,
        NO_RULESET_TYPE_RPOVIDED: `Please provide the type of TypeExtension [${EVENTS.POPULATION}|${EVENTS.VALIDATION}]`,
        FILE_CREATION_ERROR: `FATAL: BAD ARGS for File`
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
    fields
}