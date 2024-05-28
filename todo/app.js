import TaskItem from "./components/taskItem.js";
//import { Sidebar } from "./components/sidebar.js";
import  List from './components/list.js'


/* this project is fully written with dominity.js before contributing please look into atoms19/dominity.js */

//app-----
let app=el('section').style({
  position:'relative',
  width:'100%',
  padding:'2rem',
  paddingTop:'0px' 
})

  
  let taskname=reactable('')
  
  export let tasks=reactable(localStorage.tasks!=undefined?JSON.parse(localStorage.tasks):[])
  export let sound=new Audio('./resources/success.mp3')
  sound.preload="auto"
  export let lists=reactable(localStorage.lists!=undefined?JSON.parse(localStorage.lists):[])
 let sampler=[]

  let currentDate=new Date()
  //currentDate.setDate(currentDate.getDate()+3)
  let defaultDue=new Date()
  defaultDue.setDate(currentDate.getDate()+1)
 // defaultDue.setMonth(5)
  
  defaultDue=`${defaultDue.toLocaleDateString('en-CA')}T00:00`.slice(0,16)
  console.log(defaultDue)

  
let sindex=reactable(0)

let views=[[currentDate,'today']]



let header=el("hgroup").addTo(app).onClick(()=>{
  if(sindex.value<views.length-1){
   // sindex.set(sindex.value+1)
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
  
  /*let tomorrowView=reactable().deriveFrom(tasks,(task)=>{
    return tasks.value.filter((t)=>{
      
    })
  })*/

  let yesterday=reactable().deriveFrom(tasks,(task)=>{
    
    return tasks.value.filter((t)=>{
      if(t.isHabit && (currentDate>new Date(t.due))){
        
        if(t.streak==undefined){t.streak=0}
        if(t.done && (Math.abs(Math.floor((currentDate-new Date(t.due)) / (1000 * 60 * 60 * 24)))<=1)){
          t.streak+=1
          t.done=false
          t.killed=false
        }else{
          t.streak=0
          t.done=false
          t.killed=false
        }
        t.due=defaultDue
      }
      return currentDate>new Date(t.due) && !t.list
         })
  })


  let SELECTED_VIEW=today



  //form fiel-----------------------------------------------------
  el('form').style({
    position:'fixed',
    bottom:'0',
    width:'90%',
    left:'50%',
    translate:'-50%',
    padding:'0rem 0rem',
  
    
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
          console.log('list creation')
          lists.value=[...lists.value,listName]
      
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
      lists.update()
      
      taskname.set(listName+(listName?"::":'')+'')   
    }
  })
  //task area------------------------------------------------
  let taskarea=el('div').style({
    maxHeight:'77vh',
    overflow:'auto',
    marginBottom:'8rem'
    
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
         
     let ls=List(tasks,name)
     ls?ls.addTo(parent):lists.value=lists.value.filter(l=>l!=name)

    })


  

  


  //updating the localstorage each time tasks is updated
  tasks.subscribe(()=>{
   
  localStorage.tasks=JSON.stringify(tasks.value)
  
  
  })
  tasks.update()
 lists.subscribe(()=>{
  localStorage.lists=JSON.stringify(lists.value)
  console.log(lists.value)
 }) 
lists.update()
//task list sharing optimiser
function getSharedList(){
   let url=new URL(window.location.href)
  let q=new URLSearchParams(url.search).get('q')
 if(q==null){
  return
 }
  
  let data=JSON.parse(q)
  let listName=data[0]
  let todoData=data[1]
  let dedocdedData=todoData.map((v)=>{
        return {name:v[0],
        done:v[1],
        createdOn:`${currentDate.toLocaleDateString('en-GB')}      ${currentDate.toLocaleTimeString('en-US')}`,
        note:v[2]||'',
        priority:'no priority',
        due:defaultDue,
        isHabit:false,
        list:listName
        }  
  })
  if(!lists.value.includes(listName)){
  lists.value=[...lists.value,listName]
  
  tasks.set([...tasks.value,...dedocdedData])
  lists.update()
  history.replaceState(null,'',`/todo`)
  }else{
    alert('duplicate list with same name found please move or delete it or make modification to url part where name of the list is ')
  }
}
getSharedList()


  if('serviceWorker' in navigator){
   navigator.serviceWorker.register('./sw.js')
  }
