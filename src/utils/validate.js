class Validate {
  isPhone (str) {
    const reg = /^1(3|4|5|6|7|8|9)\d{9}$/
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
