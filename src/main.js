import taskStatus from '../model/taskModel.js'
import Form from './lib/form.js';
import Task from './lib/task.js';
import Storage from './lib/storage.js'

class Main {
    constructor() {
        const form = new Form("task-form", taskStatus)
        const storage = new Storage("Todo")
        const task = new Task("taskList", taskStatus, storage.getData(), storage)

        form.form.addEventListener("submit", (event) => {
            event.preventDefault();
            if (!form.validate())
                return
            const formData = form.getFormData()
            if (form.isUpdate()) {
                const oldData = storage.update(formData)
                task.updateTaskList(formData, oldData)
            } else {
                storage.insert(formData)
                task.display(formData)
            }
            form.reset()
        })

        task.container.addEventListener("edit", () => {
            const editData = storage.getData(task.editId)
            form.updateForm(editData)
        })

        task.container.addEventListener("delete", () => {
            form.reset()
            const deleteTask = storage.delete(task.deleteId)
            if (deleteTask !== null)
                task.removeTask(deleteTask)
        })
    }
}
new Main();