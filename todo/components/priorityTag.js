export default function priorityTagItem(p){
    let color='grey'
    switch (p){
      case 'alpha':
        color='#b52d58'
        break;
      case 'beta':
        color='#6466b0'
        break
      case 'gama':
        color="#997b53"
        break
      case 'sigma':
        color="#8d5399"
  
  
    }
    return el('div',p).style({
      backgroundColor:color,
      padding:'0.125rem 0.25rem',
      fontSize:'0.7rem',
      color:'rgba(0,0,0,0.7)',
      borderRadius:'0.3rem',
      fontWeight:'500',
      marginLeft:'0.5rem',
      display:color=='grey'?'none':'inline-flex'
  
    })
  }
  