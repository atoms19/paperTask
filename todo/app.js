import TaskItem from "./components/taskItem.js";
import { Sidebar } from "./components/sidebar.js";
import  List from './components/list.js'




//app-----
let app=el('section').style({
  position:'relative',
  width:'90%',
  padding:'2rem',
  paddingTop:'0px'
  
})



  
  //let introTasks='[{"name":"welcome to todo 🎉🎉","done":false,"createdOn":"","note":"","priority":""},{"name":"tap on a task to add notes/priority to it📝","done":"","createdOn":"","note":"","priority":""},{"name":"welcome to aw-tasks 🎉","done":false,"createdOn":"15/05/2024      1:31:47 AM","note":"","priority":"no priority","due":"2040-10-23T00:00","isHabit":false},{"name":"tap on name of todo👆 ","done":false,"createdOn":"15/05/2024      1:31:47 AM","note":"","priority":"no priority","due":"2050-03-12T12:02","isHabit":false}]'
  
  
  let taskname=reactable('')
  
  export let tasks=reactable(localStorage.tasks!=undefined?JSON.parse(localStorage.tasks):[])
  export let sound=new Audio('./resources/success.mp3')
  sound.preload="auto"
  let lists=reactable(localStorage.lists!=undefined?JSON.parse(localStorage.lists):[])
 
  let currentDate=new Date()
  currentDate.setUTCDate(currentDate.getUTCDate()+4)
  let defaultDue=new Date() 
  defaultDue.setUTCHours(0,0,0)
  defaultDue.setUTCDate(currentDate.getUTCDate()+1)
  let tomorrow=defaultDue
  defaultDue=defaultDue.toISOString().slice(0,16)
  let dayAfterTomorrwow=new Date()
  dayAfterTomorrwow.setUTCDate(tomorrow.getUTCDate()+1)

  
  
let sindex=reactable(0)

let views=[[currentDate,'today'],[tomorrow,'tomorrow'],[dayAfterTomorrwow,'day after tomorrow']]




let header=el("hgroup").addTo(app).onClick(()=>{
  if(sindex.value<views.length-1){
    sindex.set(sindex.value+1)
  }else{
    sindex.set(0)
  }
  

})

sindex.subscribe((p)=>{
  let [SELECTED_DATE,SELECTED_VIEW_NAME]=views[sindex.get()]
  header.html('').
  _el("h3",SELECTED_VIEW_NAME).$end(). 
  _el("p",`${SELECTED_DATE.toLocaleString("en-us",{weekday:'long'}).toLowerCase()} ,${SELECTED_DATE.getDate()} ${SELECTED_DATE.toLocaleString("en-us",{month:'long'})}`)
  .style({
    fontSize:'0.8rem',
    marginLeft:'0.4rem'
  })
  .$end(). 
  style({
    paddingTop:'2.4rem'
  })
})

  
  let today=reactable().deriveFrom(tasks,(task)=>{

    return tasks.value.filter((t)=>{


      return currentDate<new Date(t.due) && !t.list
         })
  })
  let tomorrowView=reactable().deriveFrom(tasks,(task)=>{
    return tasks.value.filter((t)=>{
      
    })
  })

  let yesterday=reactable().deriveFrom(tasks,(task)=>{
    
    return tasks.value.filter((t)=>{
      if(t.isHabit && (currentDate>new Date(t.due))){
        t.due=defaultDue
        if(t.streak==undefined){t.streak=0}
        if(t.done){
          t.streak+=1
          t.done=false
        }else{
          t.streak=0
        }
      }
      return currentDate>new Date(t.due) && !t.list
         })
  })


  let SELECTED_VIEW=today



  //form fiel-----------------------------------------------------
  el('form').style({
    position:'absolute',
    bottom:'0.5rem',
    width:'90%',
    translate:'0%',
    padding:'0rem 1rem',
  
    
  }).addTo(app)
  ._el('fieldset',{
    role:'group'
  }).
    _el('input',{
      type:'text',
        ariaLabel:'taskname field'
      ,placeHolder:'enter task'
      ,autocomplete:'off'
    }).model(taskname).$end().
    _el('input',{
      type:'submit',
      value:'add task'
    
    }).$end()
  .$end().
  checkFor('submit',(e)=>{
    e.preventDefault()
    let listName=''
    let taskNameE=''
    if(taskname.value !=''){
       let indexOfSplit=taskname.value.search("::")

      if(indexOfSplit!=-1){
        listName=taskname.value.slice(0,indexOfSplit)
        taskNameE=taskname.value.slice(indexOfSplit+2)
        
        
        if(!lists.value.includes(listName)){
          lists.set([...lists.value,listName])
        }
      }else{
        taskNameE=taskname.get()
      }
      
      tasks.value.push({
        name:taskNameE,
        done:false,
        createdOn:`${currentDate.toLocaleDateString('en-GB')}      ${currentDate.toLocaleTimeString('en-US')}`,
        note:'',
        priority:'no priority',
        due:defaultDue,
        isHabit:false,
        list:listName
      })
      tasks.update()
      taskname.set(listName+(listName?"::":'')+'')   
    }
  })
  //task area------------------------------------------------
  let taskarea=el('div').style({
    maxHeight:'77vh',
    overflow:'auto'
    
  })._el('ul').style({
  listStyle:'none',
  padding:'0px',
  paddingTop:'2rem',
    margin:'0px',
 
  }).loops(SELECTED_VIEW,(obj,p)=>{
  
    TaskItem(obj).addTo(p)
    
  })
  .$end().addTo(app)
  //due tasks-----------------------
  
  el('section').addTo(taskarea)
  ._el('hgroup',{id:'no-task'}).style({textAlign:'center',padding:'2rem',paddingTop:'1rem'}).
  _el('h5','you have no pending tasks').$end()
  ._el('p','add a new task by entering the name of task in the field above').$end()
  .showIf(tasks,t=>t.length==0)
  .$end()
  ._el('div').style({
    marginTop:'4rem'
  }).
 _el('details',{class:'list'}).
    _el('summary','over due tasks').$end(). 
    _el('p').loops(yesterday,(obj,p)=>{
      if(!obj.done){
        TaskItem(obj).addTo(p)
      }
    }).$end().showIf(yesterday,(d)=>d.filter(obj=>!obj.done).length>0)
    .$end().
  
    _el('details',{class:'list'}).
    _el('summary','completed earlier').$end(). 
    _el('p').loops(yesterday,(obj,p)=>{
      if(obj.done){
        TaskItem(obj).addTo(p)
      }
    }).$end().showIf(yesterday,(d)=>d.filter(obj=>obj.done).length>0)
    
    .$end()
    ._el('div').loops(lists,(name,parent)=>{
      parent._el(List(tasks,name))
    })

Sidebar(app)
  

  


  //updating the localstorage each time tasks is updated
  tasks.subscribe(()=>{
   
  localStorage.tasks=JSON.stringify(tasks.value)
  
  })
  tasks.update()
  lists.subscribe(()=>{
   
    localStorage.lists=JSON.stringify(lists.value)
    
    })


  if('serviceWorker' in navigator){
   navigator.serviceWorker.register('./sw.js')
  }
