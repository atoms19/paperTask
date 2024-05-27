
let open=reactable(false)    

export function Sidebar(app){
    
    return (
            el('div').style({
                display:'flex'
                ,width:'100%'
                ,height:'100vh',
                justifyContent:'center',
                flexDirection:'row'
            }).
                _el('aside',{id:['sidebar']}).style({
                    height:'100vh',
                    margin:'0',
                    display:'flex',
                    flexDirection:'column',
                    width:open.get()?'40%':'0%',
                    overflow:'hidden',
                    background:'var(--pico-form-element-background-color)'
                })._el(SidebarContent()).$end().$end().
                _el('slot')._el(app).$end().$end()
        )

}


function SidebarContent(){

return (
    el('div').
    _el('header').style({
        display:'flex',
        width:'100%',
        flexDirection:'row-reverse'
        ,padding:'0.3rem'
    }).onClick(()=>{
        open.set(false)
    }).
    _el('span').style({
        padding:'0.2rem'    
    }).html(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M19 4.001H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-12a2 2 0 0 0-2-2Zm-15 2a1 1 0 0 1 1-1h4v14H5a1 1 0 0 1-1-1v-12Zm6 13h9a1 1 0 0 0 1-1v-12a1 1 0 0 0-1-1h-9v14Z" clip-rule="evenodd"></path></svg>
`).$end()
.$end()
    ._el('div').
        _el('div','today',{class:'menu-item'}).$end().
        _el('div','tommorrow',{class:'menu-item'}).$end().
        _el('div','this week',{class:'menu-item'}).$end(). 
        _el('div','this month',{class:'menu-item'}).$end()


    .$end()

)




}

el('style').html(`
    .menu-item{
        padding:0.5rem 1rem;
        border-radius:0.3rem;
        font-size:0.9rem;
        color:var(--pico-muted-color);
        cursor:pointer;
    }
    .menu-item:hover{
        background:#f4f4f4;
    }
    [data-theme='dark'] .menu-item:hover{
        background:rgba(0,0,0,0.25);
    }
`)