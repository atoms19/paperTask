import TaskItem from "./taskItem"
export default function List(task,listName){
    return (
        el('details').style({
        marginTop:'4rem'
      }).
        _el('summary','over due tasks').$end(). 
        _el('p').loops(yesterday,(obj,p)=>{
          if(!obj.done){
            TaskItem(obj).addTo(p)
          }
        }).$end()
    )
}