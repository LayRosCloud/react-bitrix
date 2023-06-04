import React, {useEffect, useState} from 'react';
import CardList from "../components/CardList/CardList";
import TaskService from "../components/API/TaskService";
import d from "difflib";

const TaskPage = () => {
    const [isLoading, setIsLoading] = useState(true)

    const [tasks, setTasks] = useState([])

    const [filter, setFilter] = useState('')

    const [filteredList, setFilteredList] = useState([])

    useEffect(()=>{
        fetchTasks()
    },[])

    useEffect(()=>{
        filterList();
    },[filter])
    function filterList(){
        const d = require('difflib')
        const filTasks = []
        for (let i = 0; i < tasks.length; i++) {
            const r = new d.SequenceMatcher(null, tasks[i].TITLE, filter)
            if(r.ratio() > 0.5){
                filTasks.push(tasks[i])
            }
        }
        setFilteredList([...filTasks])
    }
    async function fetchTasks(){
        setIsLoading(true)
        const task = await TaskService.getAll();
        const tasksResulting = task.result
        for (let i = 0; i < tasksResulting.length; i++) {

            const decisions = await TaskService.getDecision(tasksResulting[i].ID)
            const result = decisions.result
            tasksResulting[i] = {...tasksResulting[i], HAS_DECISION: result.length !== 0}
        }
        setTasks(tasksResulting)
        setIsLoading(false)
    }
    return (
        <div>
            <input onChange={(e)=>{setFilter(e.target.value)}} className="inp" type="text" placeholder="поиск..." value={filter}/>

            { filteredList.length !== 0 && filter
                ? <CardList header={'Необходимые вам задачи'} array={filteredList}/> : ''
            }
            { isLoading
                ? <h1>Идет загрузка...</h1>
                : <CardList header={'Список задач'} array={tasks}/>
            }

        </div>
    );
};

export default TaskPage;