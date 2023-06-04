import TaskPage from "../pages/TaskPage";
import IdTaskPage from "../pages/IdTaskPage";

export const router = [
    {path: '/', component: TaskPage },
    {path: '/tasks/:id', component: IdTaskPage },
]