'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.LoginDto = void 0
class LoginDto {
  username
  password
  constructor(username, password) {
    this.username = username
    this.password = password
  }
  static createLoginWithCorrectData() {
    return new LoginDto(process.env.USER || '', process.env.PASSWORD || '')
  }
  static createLoginWithIncorrectData() {
    return new LoginDto('incorrect-username', 'incorrect-password')
  }
}
exports.LoginDto = LoginDto
