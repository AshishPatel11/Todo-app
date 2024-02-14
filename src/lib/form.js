export default class Form {
    constructor(formId, status) {
        this.status = status
        this.form = document.getElementById(formId)
        const select = document.getElementById("taskStatus")
        this.status.forEach(element => {
            this.createElements("option", { value: element.name }, select, element.name)
        })
        document.getElementById("resetBtn").addEventListener("click", this.reset)
        document.getElementById("taskName").addEventListener("change", function () {
            const small = document.getElementById("nameError")
            small.innerText = ""
            this.classList.remove("invalid-input")
        })
    }
    getFormData() {
        let formData = {}
        const inputs = this.form.querySelectorAll("input, textarea, select")
        inputs.forEach(input => {
            formData = { ...formData, [input.id]: input.value }
        })
        if (!formData.taskId)
            formData.taskId = Date.now()
        return formData;
    }

    updateForm(data) {
        this.reset();
        document.getElementById("status-div").style.display = "block"
        document.getElementById("submitBtn").innerText = "Save Task"
        for (const key in data) {
            document.getElementById(key).value = data[key]
        }
    }

    setAttributes(element, attributes) {
        for (const key in attributes) {
            element.setAttribute(key, attributes[key])
        }
    }
    createElements(tag, attributes, parent, innerText) {
        const element = document.createElement(tag)
        this.setAttributes(element, attributes)
        element.innerText = innerText ?? ""
        parent.appendChild(element)
        return element
    }
    isUpdate() {
        return document.getElementById("taskId").value
    }
    reset = () => {
        this.form.reset()
        document.getElementById("status-div").style.display = "none"
        document.getElementById("submitBtn").innerText = "Add Task"
        document.getElementById("taskId").value = ""
        const input = document.getElementById("taskName")
        const small = document.getElementById("nameError")
        small.innerText = ""
        input.classList.remove("invalid-input")
    }
    validate() {
        const input = document.getElementById("taskName")
        let validate = true
        if (!input.value) {
            validate = false
            const small = document.getElementById("nameError")
            small.innerText = "Please Enter The Value!"
            input.classList.add("invalid-input")
        }
        return validate
    }
}