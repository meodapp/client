export class TerminologyTranslator {
    constructor(dict) {
        this.dict = dict;
    }
    get(key) {
        try{
            return this.dict.find(item => item.value === key).label
        } catch {
            try{
                return this.dict.find(item => item.value === key.split(" ")[0]).label
            } catch {
                return key;
            }
        }
    }
}