class Calculator {
	constructor(currentOutputInputElement, previousOutputTextElement) {
		this.currentOutputInputElement = currentOutputInputElement
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

	toggleSign() {
		if (this.currentOutput !== "0") {
			this.currentOutput = this.currentOutput.startsWith("-")
				? this.currentOutput.slice(1)
				: "-" + this.currentOutput
			this.updateDisplay()
		}
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

	getDisplayNumber(number) {
		const stringNumber = number.toString()
		const integerDigits = parseFloat(stringNumber.split(".")[0])
		const decimalDigits = stringNumber.split(".")[1]
		let integerDisplay
		if (isNaN(integerDigits)) {
			integerDisplay = ""
		} else {
			integerDisplay = integerDigits.toLocaleString("en", {
				maximumFractionDigits: 0,
			})
		}
		if (decimalDigits != null) {
			return `${integerDisplay}.${decimalDigits}`
		} else {
			return integerDisplay
		}
	}

	updateDisplay() {
		this.currentOutputInputElement.value = this.getDisplayNumber(
			this.currentOutput
		)
		if (this.operation != null) {
			this.previousOutputTextElement.innerText = `${this.getDisplayNumber(
				this.previousOutput
			)} ${this.operation}`
		} else {
			this.previousOutputTextElement.innerText = ""
		}
	}
}

const currentOutputInputElement = document.querySelector(
	"[data-current-output]"
)
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
const clearButtons = document.querySelectorAll("[data-all-clear]")
const negateButton = document.querySelector("[data-negate]")

const calculator = new Calculator(
	currentOutputInputElement,
	previousOutputTextElement
)

calculator.updateDisplay()

numberButtons.forEach((button) => {
	button.addEventListener("click", () => {
		calculator.appendNumber(button.innerText)
		calculator.updateDisplay()
	})
})

clearButtons.forEach((button) => {
	button.addEventListener("click", () => {
		calculator.clear()
		calculator.updateDisplay()
	})
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

negateButton.addEventListener("click", () => {
	calculator.toggleSign()
})
