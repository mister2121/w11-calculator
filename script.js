class Calculator {
	constructor(currentOutputTextElement, previousOutputTextElement) {
		this.currentOutputTextElement = currentOutputTextElement
		this.previousOutputTextElement = previousOutputTextElement
		this.clear()
		this.justComputed = false
	}

	clear() {
		this.currentOutput = "0"
		this.previousOutput = ""
		this.operation = undefined
		this.justComputed = false
	}

	delete() {
		if (this.currentOutput === "0") return
		this.currentOutput = this.currentOutput.toString().slice(0, -1)
	}

	appendNumber(number) {
		if (number === "." && this.currentOutput.includes(".")) return

		if (this.justComputed) {
			this.currentOutput = ""
			this.justComputed = false
		}

		if (this.currentOutput === "0" && number !== ".") {
			this.currentOutput = number.toString()
		} else {
			this.currentOutput = this.currentOutput.toString() + number.toString()
		}
	}

	chooseOperation(operation) {
		if (this.currentOutput === "") return

		if (operation === "1/x" || operation === "x²" || operation === "√x") {
			this.operation = operation
			this.singleOperationCompute()
			this.updateDisplay()
			return
		}

		if (this.previousOutput !== "") {
			this.compute()
		}

		this.operation = operation
		this.previousOutput = this.currentOutput
		this.currentOutput = "0"
	}

	compute() {
		let computation
		const prev = parseFloat(this.previousOutput)
		const current = parseFloat(this.currentOutput)

		if (isNaN(current)) return

		switch (this.operation) {
			case "+":
				computation = prev + current
				break
			case "-":
				computation = prev - current
				break
			case "x":
				computation = prev * current
				break
			case "÷":
				computation = prev / current
				break
			case "1/x":
				computation = 1 / current
				break
			default:
				return
		}
		this.currentOutput = computation
		this.operation = undefined
		this.previousOutput = ""
		this.justComputed = true
	}

	singleOperationCompute() {
		let computation
		const current = parseFloat(this.currentOutput)
		if (isNaN(current)) return

		switch (this.operation) {
			case "1/x":
				computation = 1 / current
				break
			case "x²":
				computation = current * current
				break
			case "√x":
				computation = Math.sqrt(current)
				break
			default:
				return
		}
		this.currentOutput = computation
		this.operation = undefined
		this.previousOutput = ""
		this.justComputed = true
	}

	updateDisplay() {
		this.currentOutputTextElement.innerText = this.currentOutput
		if (this.operation != null) {
			this.previousOutputTextElement.innerText = `${this.previousOutput} ${this.operation}`
		} else {
			this.previousOutputTextElement.innerText = ""
		}
	}
}

const currentOutputTextElement = document.querySelector("[data-current-output]")
const previousOutputTextElement = document.querySelector(
	"[data-previous-output]"
)
const numberButtons = document.querySelectorAll("[data-number]")
const operationButtons = document.querySelectorAll("[data-operation]")
const singleOperationButtons = document.querySelectorAll(
	"[data-single-operation]"
)
const equalButton = document.querySelector("[data-equals]")
const deleteButton = document.querySelector("[data-delete]")
const clearButton = document.querySelector("[data-all-clear]")

const calculator = new Calculator(
	currentOutputTextElement,
	previousOutputTextElement
)

calculator.updateDisplay()

numberButtons.forEach((button) => {
	button.addEventListener("click", () => {
		calculator.appendNumber(button.innerText)
		calculator.updateDisplay()
	})
})

clearButton.addEventListener("click", () => {
	calculator.clear()
	calculator.updateDisplay()
})

operationButtons.forEach((button) => {
	button.addEventListener("click", () => {
		calculator.chooseOperation(button.innerText)
		calculator.updateDisplay()
	})
})

singleOperationButtons.forEach((button) => {
	button.addEventListener("click", () => {
		calculator.chooseOperation(button.innerText)
		calculator.updateDisplay()
	})
})

equalButton.addEventListener("click", (button) => {
	calculator.compute()
	calculator.updateDisplay()
})

deleteButton.addEventListener("click", (button) => {
	calculator.delete()
	calculator.updateDisplay()
})
