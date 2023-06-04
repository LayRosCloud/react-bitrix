import axios from "axios";

export default class CommentService{
    static async addComment(taskId, message='', isAnswer){
        const response = await axios.get(`https://b24-ixczqa.bitrix24.ru/rest/10/vc4i6ixig4ydymnt/task.commentitem.add?taskId=${taskId}&FIELDS[POST_MESSAGE]=${message}`)
        if(isAnswer === true){
            const idComment = response.data.result;
            await axios.get(`https://b24-ixczqa.bitrix24.ru/rest/10/vc4i6ixig4ydymnt/tasks.task.result.addFromComment.json?commentId=${idComment}`)

        }
    }
}