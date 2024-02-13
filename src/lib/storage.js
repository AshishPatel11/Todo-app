export default class Storage {
    constructor(storageId) {
        this.storageId = storageId
    }
    set(data) {
        return localStorage.setItem(this.storageId, JSON.stringify(data))
    }
    insert(data) {
        const oldData = this.getData()
        oldData.push(data);
        return this.set(oldData)
    }
    //returns the specific record or all records
    getData(dataId) {
        if (dataId) {
            const storageData = JSON.parse(localStorage.getItem(this.storageId)) ?? []
            return storageData.find(data => data.taskId == dataId)

        } else {
            return JSON.parse(localStorage.getItem(this.storageId)) ?? []
        }
    }

    //delete the specific record by given userId
    delete(id) {
        const records = this.getData()
        const index = records.findIndex(record => Number(record.taskId) === Number(id))
        if (confirm("Do you want to delete this task permanently??")) {
            const deleteData = records.splice(index, 1)
            this.set(records)
            return deleteData[0]
        }
        else {
            return null
        }
    }

    update(data) {
        const records = this.getData()
        const index = records.findIndex(record => Number(record.taskId) === Number(data.taskId))
        const oldData = records.splice(index, 1, data)
        this.set(records)
        return oldData[0]
    }
    search(TaskName) {
        const record = this.getData()
        const searchRecords = record.filter(data => data.taskName.toLowerCase().includes(TaskName.trim().toLowerCase()))
        return searchRecords
    }

    static updateStatus(id, status) {
        const records = JSON.parse(localStorage.getItem("Todo"))
        const index = records.findIndex(record => Number(record.taskId) === Number(id))
        const [updateData] = records.splice(index, 1)
        updateData.taskStatus = status
        records.push(updateData)
        localStorage.setItem("Todo", JSON.stringify(records))
    }
}