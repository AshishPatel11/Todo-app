import taskStatus from "../../model/taskModel.js"
import Storage from "./storage.js"

export default class Task {
    constructor(taskListId, status, data, storage) {
        this.container = document.getElementById(taskListId)
        this.storage = storage
        this.cardList = this.container.querySelector(".card-container")
        this.searchForm = document.getElementById("search-form")
        this.searchForm.addEventListener("submit", this.search)
        document.getElementById("resetSearch").addEventListener("click", this.resetSearch)
        this.status = status

        this.status.forEach((sts, key) => {
            const div = this.createElements("div", { class: `card m-2 status${key + 1}  card-boxs`, id: `status-${key + 1}`, style: `border-color:${sts.color}` }, this.cardList)
            this.createElements("h3", { class: "card-header", style: `background-color:${sts.color}` }, div, sts.name)
            document.getElementById(`status-${key + 1}`).addEventListener("dragover", (event) => { event.preventDefault() })
            document.getElementById(`status-${key + 1}`).addEventListener("drop", this.drop)
        })

        data.forEach(record => {
            this.display(record)
        })

        this.editEvent = new Event("edit")
        this.deleteEvent = new Event("delete")
        this.editId = null
        this.deleteId = null
    }

    display(data) {
        // const [status1, status2, status3, status4] = this.status
        const index = this.status.findIndex(element => element.name === data.taskStatus)
        const statusCard = this.cardList.querySelector(`#status-${index + 1}`)
        statusCard.appendChild(this.getCard(data))
    }

    getCard(data) {
        //Create new card as per given data
        const newTaskCard = this.createElements("div", { draggable: true, class: "card m-3 mb-0 p-3 task-card", id: `task_${data.taskId}`, style: `border-color:inherit`, ondragstart: this.drag })
        const taskHeader = this.createElements("div", { class: "d-flex justify-content-between" }, newTaskCard)
        this.createElements("h5", { class: "card-title fw-semibold" }, taskHeader, data.taskName)
        const options = this.createElements("div", { class: "d-flex" }, taskHeader)

        this.createElements("a", { class: "m-2 link-primary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover", href: "edit", id: `edit_${data.taskId}`, onclick: this.edit, draggable: false }, this.createElements("p", {}, options), "Edit")

        this.createElements("a", { class: "link-danger link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover", href: "delete", id: `delete_${data.taskId}`, onclick: this.delete, draggable: false }, this.createElements("p", {}, options), "Delete")

        this.createElements("p", { class: "card-text" }, this.createElements("div", {}, newTaskCard), data.TaskDescription)
        return newTaskCard
    }

    edit = (event) => {
        event.preventDefault()
        this.editId = Number(event.target.id.split("_")[1])
        this.container.dispatchEvent(this.editEvent)
    }

    delete = (event) => {
        event.preventDefault()
        this.deleteId = Number(event.target.id.split("_")[1])
        this.container.dispatchEvent(this.deleteEvent)
    }

    setAttributes(element, attributes) {
        for (const key in attributes) {
            if (["onclick", "ondragstart", "onsubmit"].includes(key))
                element.addEventListener(key.slice(2), attributes[key])
            else
                element.setAttribute(key, attributes[key])
        }
    }

    createElements(tag, attributes, parent = null, innerText) {
        const element = document.createElement(tag)
        this.setAttributes(element, attributes)
        element.innerText = innerText ?? ""
        if (parent)
            parent.appendChild(element)
        return element
    }

    updateTaskList(newData, oldData) {
        const oldCard = document.getElementById(`task_${oldData.taskId}`)
        if (newData.taskStatus === oldData.taskStatus) {
            oldCard.replaceWith(this.getCard(newData))
        }
        else {
            oldCard.remove()
            this.display(newData)
        }
    }

    removeTask(cardData) {
        const card = document.getElementById(`task_${cardData.taskId}`)
        card.remove()
    }

    search = (event) => {
        event.preventDefault()
        const searchValue = document.getElementById("searchBox").value
        const result = this.storage.search(searchValue)
        document.querySelectorAll(".task-card").forEach(card => card.style.display = "none")
        result.forEach(res => document.getElementById(`task_${res.taskId}`).style.display = "flex")
    }

    resetSearch = () => {
        document.querySelectorAll(".task-card").forEach(card => card.style.display = "flex")
    }

    drag = (event) => {
        event.dataTransfer.setData("cardId", event.target.id)
    }

    drop(event) {
        event.preventDefault();
        const cardId = event.dataTransfer.getData("cardId")
        this.appendChild(document.getElementById(cardId))
        Storage.updateStatus(Number(cardId.split("_")[1]), taskStatus[Number(this.id.split("-")[1]) - 1].name)
    }
}