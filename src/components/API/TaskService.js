import axios from "axios";

export default class TaskService{
    static async getAll(){
        const response = await axios.get('https://b24-ixczqa.bitrix24.ru/rest/10/vc4i6ixig4ydymnt/task.ctaskitem.getlist.json')
        return response.data
    }
    static async getOne(id){
        const response = await axios.get(`https://b24-ixczqa.bitrix24.ru/rest/10/vc4i6ixig4ydymnt/tasks.task.get.json?taskId=${id}`)
        return response.data
    }
    static async getComments(idTask){
        const response = await axios.get(`https://b24-ixczqa.bitrix24.ru/rest/10/vc4i6ixig4ydymnt/task.commentitem.getlist.json?taskId=${idTask}`)
        return response.data
    }
    static async getDecision(idTask){
        const response = await axios.get(`https://b24-ixczqa.bitrix24.ru/rest/10/vc4i6ixig4ydymnt/tasks.task.result.list.json?taskId=${idTask}`)
        return response.data
    }
}
