class Validate {
  isPhone (str) {
    const reg = /^(0|86|17951)?(13[0-9]|14[57]|15[012356789]|17[0-9]|18[0-9])[0-9]{8}$/
    return reg.test(str)
  }
  password (str) {
    const reg = /^.*(?=.{8,})(?=.*[a-z])(?=.*[A-Z]).*$/
    return reg.test(str)
  }
  email (str) {
    const reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
    return reg.test(str)
  }
}
export default new Validate()
