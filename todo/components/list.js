import TaskItem from "./taskItem.js";

export default function List(tasks,listName){
    return (
        el('details',{class:'list'}).
        _el('summary',listName).$end(). 
        _el('p').loops(tasks,(obj,p)=>{
          if(obj.list==listName){
            TaskItem(obj).addTo(p)
          }
        }).$end().showIf(tasks,(d)=>d.filter(obj=>obj.list==listName).length>0)
    )
}

el('style').html(`
.list summary{
  overflow:hidden;
  padding:0.2rem;
  border-radius:0.2rem;
}



`)
