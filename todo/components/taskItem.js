import MoreInfoItem from "./popup.js"
import priorityTagItem from "./priorityTag.js"
import {tasks,sound} from '../app.js'



function taskCompletionFeedBack(){
  sound.volume=1
  sound.play()
  
  
  setTimeout(()=>{
      sound.pause();
      sound.currentTime = 0;
    }, 1000);

}

export default function TaskItem(task){
    return el('li').style({
        width:'100%',
        display:'flex',
        justifyContent:'space-between',
        alignItems:'center',
  
        padding:'0.5rem 1rem'
        
      }).
        _el('input','',{
          type:'checkbox',
            ariaLabel:'complete task'
         
        }).style({
          minWidth:'1.1rem'
        }).attr(task.done?('checked'):'unchecked','').checkFor('input',()=>{
          task.done=!task.done
          tasks.setProp('done',task.done)
          if(task.done){
            taskCompletionFeedBack()
          }
          
        })
        .$end().
        _el('span',task.name).style({
          textDecoration:task.done?'line-through':'none',
          opacity:task.done?'0.5':'1',
          textAlign:'center',
          cursor:"pointer"
        }).onClick(()=>{
          MoreInfoItem(task) //model popup being triggered
        }).addChild(priorityTagItem(task.priority).style({
          textDecoration:task.done?'line-through':'none',
          
        })).$end().
        _el('button',{ariaLabel:'close',title:"remove task"}).html(`<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
      </svg>`).class('outline').style({
          padding:'0.3rem',
          display:'inline-flex',
          alignItems:'center',
          justifyContent:'center'
      }).onClick((s)=>{
    if(task.note.trim()!='' || task.streak>0){
      let ans=confirm('this task has a note inside it ?,mind opening and looking before deleting')
      if(ans==true){
        MoreInfoItem(task)
        return
      }
    }
   tasks.set(tasks.value.filter(ob=>{
     return ob!=task
   }))
        }).$end()
  
  }
  