import {tasks} from '../app.js'


export default function MoreInfoItem(task){
    let content=reactable(task.note).as('s')
    let priority=reactable(task.priority)
    let due=reactable(task.due)
    let habit=reactable(task.isHabit)
    content.subscribe((d)=>{
        task['note']=d.value
        tasks.update()
    })
    
    priority.subscribe((d)=>{
        task['priority']=d.value
        tasks.update()
    })
    
    due.subscribe((d)=>{
      task['due']=d.value
      tasks.update()
      
    })

    habit.subscribe((d)=>{
      task['isHabit']=d.value
      tasks.update()
    })
  
    
    let priorityTAGs=reactable(['no priority','alpha','beta','gama','sigma'])
    


      el('dialog',{open:''}).
              onClick((s)=>{
                s.remove()
              }). 
          _el('article').onClick((s,e)=>{
            e.stopPropagation()
          }).
              _el('header').
                _el('button',{ariaLabel:'close',rel:'prev'}).onClick(s=>{
                  s.parent().parent().parent().remove()
                }).$end(). 
                _el('p')._el('strong',`📝 ${task.name}`).$end().
                _el('p',"🔥streak: "+(task.streak||'0')+" days").style({
                  fontSize:"0.8rem",
                  marginLeft:'1.35rem',
                  marginTop:'0.4rem',
                  filter:task.streak?'grayscale(0%)':'grayscale(100%)',
                  display:'inline',
                  width:'40%',
                  marginBottom:'0px'
                }).attr('data-tooltip','will be updated on 12am').showIf(habit).$end()
                .$end()
              .$end().
          _el('textarea',{
              placeHolder:'type a note',
              id:'type-zone'
          }).style({
            height:'8rem'
          }).model(content).$end().
          _el('label','prority'). //dropdown
            _el('select',{name:'select',ariaLabel:'select priority'}).loops(priorityTAGs,(p,s,i)=>{
                s. 
                  _el("option",p).$end()
              }).model(priority).$end()
          .$end().
          _el('label','notify (due date)'). //dropdown
          _el('input',{ariaLabel:'select due date',type:"datetime-local",min:new Date().toISOString().slice(0,16)}).model(due).$end()
        .$end().
        _el('label','habbit task(reccuring)'). //dropdown
        _el('input',{ariaLabel:'toggling habbit',id:'h',name:'habbit',role:'switch',type:"checkbox"}). 
        style({
          marginLeft:'1rem'
        }).model(habit)
        .$end()
      .$end().
          _el('footer')._el('span',`created on: ${task.createdOn}`).style({
            color:'var(--pico-muted-color)'
          }).$end().
          $end(). 
      $end()
     
      

    
    }
    