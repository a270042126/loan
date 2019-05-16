/*
user: {
   name: ''
},
rules: {
  name: [
   {require: true, message: ''},
   {min:3, max:5, message: ''}
  ]
}
 */
class FormValidate {
  static checkForm (verifiesData, rules) {
    let result = []
    this.handleRecursive(verifiesData, rules, result)
    return result
  }

  static handleRecursive (verifiesData, rules, resultArr) {
    for (let key in rules) {
      const ruleObj = rules[key]
      let data
      try {
        data = verifiesData[key]
      } catch (e) {
        break
      }
      const result = this.handleRules(data, ruleObj)
      if (result) {
        const item = {
          field: key,
          message: result
        }
        resultArr.push(item)
      } else {
        this.handleRecursive(data, ruleObj, resultArr)
      }
    }
  }

  static handleRules (value, ruleArr) {
    for (let key in ruleArr) {
      let rule = ruleArr[key]
      if (rule.hasOwnProperty('require') && rule['require'] && !String(value).trim()) {
        return rule.message
      } else if (value) {
        if (rule.hasOwnProperty('min') && String(value).trim().length < Number(rule['min'])) {
          return rule.message
        } else if (rule.hasOwnProperty('max') && String(value).trim().length > Number(rule['max'])) {
          return rule.message
        } else if (rule.hasOwnProperty('rule') && !rule['rule'].test(value)) {
          return rule.message
        }
      }
    }
  }
}
export default FormValidate
