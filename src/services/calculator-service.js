class CalculatorService {
  constructor () {
    this.basicOperations = {
      addition: (a, b) => a + b,
      subtraction: (a, b) => a - b,
      multiplication: (a, b) => a * b,
      division: (a, b) => a / b
    }
  }

  async calculateBasic ({ operationType, firstParam, secondParam }) {
    return this.basicOperations[operationType](firstParam, secondParam)
  }
}

module.exports = CalculatorService
