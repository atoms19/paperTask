import {tasks} from '../app.js'

export default function MoreInfoItem(task){
    let content=reactable(task.note).as('s')
    let priority=reactable(task.priority)
    content.subscribe((d)=>{
        task['note']=d.value
        tasks.update()
    })
    content.update()
    priority.subscribe((d)=>{
        task['priority']=d.value
        tasks.update()
    })
    priority.update()
    
    let priorityTAGs=reactable(['no priority','alpha','beta','gama','sigma'])
    return  el('dialog',{open:''}). 
          _el('article'). 
              _el('header'). 
                _el('button',{ariaLabel:'close',rel:'prev'}).onClick(s=>{
                  s.parent().parent().parent().remove()
                }).$end(). 
                _el('p')._el('strong',`📝 ${task.name}`).$end()
                .$end()
              .$end().
          _el('textarea',{
              placeHolder:'type a note'
          }).style({
            height:'8rem'
          }).model(content).$end().
          _el('label','prority'). //dropdown
            _el('select',{name:'select',ariaLabel:'select priority'}).loops(priorityTAGs,(p,s,i)=>{
                s. 
                  _el("option",p).$end()
              }).model(priority).$end()
          .$end().
          _el('span',`created on: ${task.createdOn}`).$end().
          _el('footer').$end(). 
      $end()
      
    
    }
    