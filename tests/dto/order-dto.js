'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.OrderDto = void 0
class OrderDto {
  status
  courierId
  customerName
  customerPhone
  comment
  id
  constructor(status, courierId, customerName, customerPhone, comment, id) {
    this.status = status
    this.courierId = courierId
    this.customerName = customerName
    this.customerPhone = customerPhone
    this.comment = comment
    this.id = id
  }
  static createOrderWithRandomData() {
    return new OrderDto(
      'OPEN',
      Math.floor(Math.random() * 100),
      'John Doe',
      '+123456789',
      'Urgent order',
      Math.floor(Math.random() * 100),
    )
  }
}
exports.OrderDto = OrderDto
