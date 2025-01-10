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
  // Lisatud tagastus: OrderDto klassi eraldi täpsustatud kui tagastustüüp
  static createOrderWithRandomData() {
    return new OrderDto(
      'OPEN', // Staatiline tellimuse staatus
      Math.floor(Math.random() * 100), // Juhuslik kulleri ID
      'John Doe', // Juhuslik klient
      '+123456789', // Telefoni number
      'Urgent order', // Tellimuse kommentaar
      Math.floor(Math.random() * 100), // Juhuslik tellimuse ID
    )
  }
}
exports.OrderDto = OrderDto
