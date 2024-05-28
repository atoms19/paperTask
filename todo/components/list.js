import { tasks,lists } from "../app.js";
import TaskItem from "./taskItem.js";

export default function List(tasks,listName){
    
    let listBox=reactable().deriveFrom(tasks,()=>{
        return tasks.value.filter((obj)=>{
          return obj.list==listName
        })
    })

    if(listBox.value.length<=0){
      return 0
    }

    

    return (
        el('details',{class:'list'}).
        _el('summary',listName).enableHold(2).checkFor('hold',()=>{
          showListEditor(listBox,listName)
        }).$end(). 
        _el('p').loops(listBox,(obj,p)=>{
        
            TaskItem(obj).addTo(p)
          
        }).$end().showIf(tasks,()=>listBox.value.length>0)
      )
}


function showListEditor(listBox,listName){
  let defaultSpread=''
  return el('dialog',{open:''}).onClick(s=>{s.remove()}).
            _el('article').onClick((s,e)=>{e.stopPropagation()}).
                _el('h3','list actions for '+listName).$end().
                _el('div',{role:'group'})
                    ._el('button','spread list to today').onClick(()=>{
                      tasks.set(tasks.value.map((v)=>{
                        if(v.list==listName && v.name.trim()!=''){
                        v.list=defaultSpread
                        }
                        return v
                      }))
                      

                    }).enableHold(2).checkFor('hold',(e)=>{
                      defaultSpread=prompt('you can enter now spread to any list , enter the list to be spread to')
                      if(lists.value.includes(defaultSpread)){
                        e.target.click()
                      }else{
                        defaultSpread=''
                        alert('list doesnt exists')
                      }
                    }).$end(). 
                    _el('button','share list as url').onClick(async()=>{
                       let toBeShared=listBox.value.map((obj)=>{
                          let packedData= [obj.name,obj.done]
                          if(obj.note.trim()!=''){
                            packedData.push(obj.note)
                          }
                          return packedData
                       })

                       let shareUrl=window.location.href+'?q='+encodeURI(JSON.stringify([listName,toBeShared]))
                       if (navigator.share) {
                        try {
                          await navigator.share({
                            title: 'sharing list:'+listName,
                            text: 'share this url to share the list:',
                            url:shareUrl
                          });
                          console.log('Content shared successfully');
                        } catch (error) {
                          console.error('Error sharing content:', error);
                        }
                      } else {
                        // Fallback: Display the URL in a modal or copy to clipboard
                        copy(shareUrl)
                        alert('share url has been copied to your clipboard ,share it by any sms or text means')
                      }
                    }).$end()
                .$end()


  
            .$end()
}





el('style').html(`
.list summary{
  overflow:hidden;
  padding:0.2rem;
  border-radius:0.2rem;
}



`)
