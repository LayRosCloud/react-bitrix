import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import TaskService from "../components/API/TaskService";
import './IdTaskPage.css'
import CardList from "../components/CardList/CardList";
import {useFetching} from "../hooks/useFetching";
import CommentService from "../components/API/CommentService";

const IdTaskPage = () => {
    const params = useParams()

    const [task, setTask] = useState({})

    const [comments, setComments] = useState([])
    const [similarTasks, setSimilarTasks] = useState([])
    const [decisions, setDecisions] = useState([])
    const [maybeDecisions, setMayBeDecisions] = useState([])
    const [activeList, setActiveList] = useState(false);

    const [fetchDecision, decisionLoader] = useFetching( async ()=>{
        const response = await TaskService.getDecision(params.id)
        setDecisions(response.result)
    })
    const [fetchTask, isLoading] = useFetching(async ()=>{
        const t = await TaskService.getOne(params.id)
        setTask(t.result.task)
    })
    const [fetchTasks, isTasksLoading] = useFetching(async ()=>{
        const tasks = await TaskService.getAll()
        const result = tasks.result;

        const diff = require('difflib')
        const resultTasks = []

        for (let i = 0; i < result.length; i++) {
            const sm = new diff.SequenceMatcher(null, task.title.toLowerCase(), result[i].TITLE.toLowerCase())
            if(sm.ratio() > 0.5 && result[i].ID !== params.id){
                resultTasks.push(result[i])
            }
        }
        for (let i = 0; i < resultTasks.length; i++) {
            const decisions = await TaskService.getDecision(resultTasks[i].ID)
            const result = decisions.result
            resultTasks[i] = {...resultTasks[i], HAS_DECISION: result.length !== 0}
            if(result.length !== 0){
                const obj = {id: resultTasks[i].ID, title: resultTasks[i].TITLE, result};
                maybeDecisions.push(obj)
            }
        }
        setSimilarTasks(resultTasks)
    })
    const [fetchComments, isCommentLoading] = useFetching(async ()=>{
        const commentsFetching = await TaskService.getComments(params.id)
        setComments(commentsFetching.result)
    })

    const [comment, setComment] = useState('')
    const [isAnswer, setAnswer] = useState(false)

    useEffect(()=>{
        clearObjects()

        fetchTask()
    },[params.id])

    useEffect(()=>{
        fetchTasks()
        fetchDecision()
        fetchComments()
    },[task])

    function clearObjects(){
        setMayBeDecisions([])
        setSimilarTasks([])
        setDecisions([])
        setComments([])
        setTask({})
    }

    async function addComment(){
        await CommentService.addComment(params.id, comment, isAnswer)
        setComment('')
        window.location.reload();
    }

    return (
        <div>
            {!isLoading
                ?<div>
                    <h1>{task.title}</h1>
                    <div>
                        <p>{task.description}</p>
                        <p>Дата создания: {task.createdDate}</p>
                    </div>
                    <div>
                        {task.creator ? <p>Выдал задание: <b>{task.creator.name}</b> </p> : ''}
                        {task.responsible ? <p>Ответственный: <b>{task.responsible.name}</b> </p> : ''}
                    </div>
                </div>
                : <h3>Идет загрузка данных...</h3>
            }
            <div className="container">
                <h2>Результат - {decisions.length}: </h2>
                {decisionLoader
                    ?<h5>Идет загрузка...</h5>

                    :decisions.length !== 0
                        ? decisions.map((decision, index) =>
                        <div key={decision.id}>
                            <p><b>{index + 1}.</b> {decision.text}</p>
                        </div>
                    ):<p>Результатов нет... Станьте первым!</p>
                }
            </div>


            {!isTasksLoading && task && similarTasks.length !== 0
                ? <CardList array={similarTasks} header='Похожие'/>
                : ''
            }
            {maybeDecisions.length !== 0 ?
                <button onClick={()=>{setActiveList(!activeList)}}>возможные решения </button>:''

            }
            {activeList
                ?<div>
                    {maybeDecisions.map((mayDecisions,mainNumber) =>
                        <div key={mayDecisions.id}>
                            <h3>{mainNumber + 1}. {mayDecisions.title}</h3>
                            {
                            mayDecisions.result.map((decision, number) =>
                                <p key={decision.id}>{mainNumber + 1}.{number + 1} {decision.text}</p>
                            )
                            }
                        </div>
                    )}
                </div>
                :''
            }
            <div className="container__comments">
                <h1>Комментарии</h1>
                <input className="inp"
                       type="text"
                       placeholder="Введите комментарий..."
                       value={comment}
                       onChange={(e)=>setComment(e.target.value)}/>
                <div>
                <input type="checkbox"
                       defaultChecked={isAnswer}
                       onClick={(e)=>setAnswer(e.target.checked)}/>
                <label htmlFor="checkbox">Отметить как ответ?</label>

                </div>

                <button onClick={() => addComment()}>Добавить</button>
                <div className="comment__contents">
                    {!isCommentLoading
                        ? comments.map(comment =>
                            <div key={comment.ID}
                                 className={comment.POST_MESSAGE.includes('[USER=') ? 'comment opacity-5': 'comment'}>
                                <h3>{comment.AUTHOR_NAME}
                                    <span style={{opacity: 0.5, fontSize:10}}>{` ${comment.POST_DATE}`}
                                    {comment.POST_MESSAGE.includes('[USER=')? ' Сообщение системы*': ''}
                                    </span>
                                </h3>
                                <p>{comment.POST_MESSAGE}</p>
                            </div>
                        )
                        : <h1>Идет загрузка...</h1>
                    }
                </div>
            </div>
        </div>
    );
};

export default IdTaskPage;