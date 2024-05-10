import TaskItem from "./components/taskItem.js";




  
  let introTasks=[{name:'welcome to todo 🎉🎉',done:false,createdOn:'',note:'',priority:""},{name:'tap on a task to add notes/priority to it📝',done:'',createdOn:'',note:"",priority:""}]
  
  
  let taskname=reactable('')
  export let tasks=reactable(localStorage.tasks?JSON.parse(localStorage.tasks):introTasks)
  export let sound=new Audio('./resources/success.mp3')
  sound.volume=0
  sound.play()
  setTimeout(()=>{
    sound.volume=1 //playing the sound in background on first load
  },2500)
  el('form').style({
    position:'fixed',
    bottom:'0.5rem',
    width:'90%',
    right:'50%',
    transform:'translateX(50%)'
    
  })
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
    if(taskname.value !=''){
      let currentDate=new Date()
      tasks.value.push({
        name:taskname.get(),
        done:false,
        createdOn:`${currentDate.toLocaleDateString('en-GB')}      ${currentDate.toLocaleTimeString('en-US')}`,
        note:'',
        priority:'no priority'
      })
      tasks.update()
      taskname.set('')   
    }
  })
  
  el('ul').style({
  listStyle:'none',
  padding:'0px',
  paddingTop:'4rem',
    margin:'0px'
  }).loops(tasks,(obj,p)=>{
  
    TaskItem(obj).addTo(p)
    
  }).$end()
  
  
  let noTaskMsg= el('hgroup').style({textAlign:'center',padding:'2rem'}).
  _el('h5','you have no pending tasks').$end()
  ._el('p','add a new task by entering the name of task in the field above').$end()
  
  
  //updating the localstorage each time tasks is updated
  tasks.subscribe(()=>{
   
  localStorage.tasks=JSON.stringify(tasks.value)
  
  
    noTaskMsg.showIf(tasks.value.length==0)
  
  
  })
  tasks.update()
