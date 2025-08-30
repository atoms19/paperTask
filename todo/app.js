import d from "https://esm.sh/dominity@6.4.6";
let APILINK="http://localhost:3000/"



let appData = d.createStore("app_data", {
   states: {
      selected_date: '',
      selected_view_name: "Today",
      isLoggedIn:false,
      accessToken:'',
      tasks:[]
   },
   getters: {
      isTaskEmpty() {
         return this.tasks.value.length == 0;
      },
   
   },
   actions: {
      addTask(store, _, data) {
         store.tasks.value = [
            ...store.tasks.value,
            {
               title: data.name,
               done: false,
               id:1001
            }
         ];

         fetch(APILINK+'todo',{
          method:'POST',
          body:JSON.stringify({
            title:data.name,
            done:false
          })
,  headers:{
               'Authorization':`Bearer ${store.accessToken.value}`,
               'Content-Type':'application/json'
            }
         })

         

      },
      modifyTaskDone(store, _, id, value) {
         console.log('modification call',id,value)
         let [task] = store.tasks.value.filter((t) => t.id == id);
         console.log(task)
         task.done = value;

         fetch(APILINK+'todo/'+id,{
            method:'PATCH',

            body:JSON.stringify({
                  "done":value
            }),
            headers:{
               'Authorization':"Bearer "+store.accessToken.value,
               'Content-Type':'application/json'
            }
         })

         localStorage.setItem("tasks", JSON.stringify(store.tasks.value));
      },

      removeTask(store, _, id) {
         store.tasks.value = store.tasks.value.filter((t) => t.id != id);
         fetch(APILINK+'todo/'+id,{
            method:'DELETE',
            headers:{
               'Authorization':"Bearer "+store.accessToken.value,
               'Content-Type':'application/json'
            }
         })

      },

      setAccessToken(store,_,token){
         store.accessToken.value=token
         store.isLoggedIn.value=true
         this.setUpSaves(store)
         localStorage.setItem('token',store.accessToken.value)
      }

,

    async setUpSaves(store) {
    //     d.effect(() => {
   //         localStorage.setItem("tasks", JSON.stringify(store.tasks.value));
    //     });
         
         let resp=await fetch(APILINK+'todo',{
            method:'GET',
            headers:{
               'Authorization':`Bearer ${store.accessToken.value}`
            }
         })
         if(resp.ok){
            store.tasks.value=await resp.json()
            
         }

         
      },
      checkIfLoggedIn(store){
         let token=localStorage.getItem('token')||''
         if(!token){
               store.isLoggedIn.value=false
         }else{
            store.accessToken.value=token
            store.isLoggedIn.value=true
            this.setUpSaves(store)
         }
      }
   }
});
appData.setUpSaves();
appData.checkIfLoggedIn()
const noTaskMsg = () => {
   return d.section(
      d
         .el(
            "hgroup",
            { id: "no-task" },
            d.h5("you have no pending task"),
            d.p(
               "add a new task by entering the name of the task in the field above"
            )
         )
         .css({ textAlign: "center", padding: "2rem", paddingTop: "1rem" })
   );
};

const header = () => {
   let selected_date = appData.getRef("selected_date");
   let selected_view_name = appData.getRef("selected_view_name");

   return d.el("hgroup", d.h3(selected_view_name), d.p(` `)).css({
      paddingTop: "2.4rem"
   });
};


const loginForm=()=>{
   let email=d.state("")
   let password=d.state("")
   return d.form(
               d.label("email")
               ,d.input({placeHolder:"enter your email", type:"email"}).model(email),
               d.label("password"),
                d.input({placeHolder:"enter your password",type:"password"}).model(password),
                d.input({type:"submit",value:"register account"})
            ).on("submit",async (e)=>{
               e.preventDefault()

               let req=await fetch(APILINK+'auth/login',{
                  method:'POST',
                  body:JSON.stringify({
                     email:email.value,
                     password:password.value
                  }),
                  headers:{
                     'Content-Type':'application/json'
                  }
               })

               if(req.ok){
                  let content=await req.json()
                  console.log(content)
                  appData.setAccessToken(content.access_token)
                  
               }
            })


}


const signUpform=()=>{
   let name=d.state("")
   let email=d.state("")
   let password=d.state("")

   return  d.form(
               d.label("name")
               ,d.input({placeHolder:"enter your name "}).model(name),
               d.label("email")
               ,d.input({placeHolder:"enter your email", type:"email"}).model(email),
               d.label("password"),
                d.input({placeHolder:"enter your password",type:"password"}).model(password),
                d.input({type:"submit",value:"register account"})
            ).on("submit",async (e)=>{
               e.preventDefault()
               let resp=await fetch(APILINK+'auth/register',{
                  method:'POST',
                  headers:{
                        'Content-Type': 'application/json',
                  },
                  body:JSON.stringify({
                     name:name.value,
                     password:password.value,
                     email:email.value
                  }),
               }) 

               if(resp.ok){
                  let content=await resp.json()
                  console.log(content)
                  appData.setAccessToken(content.accessToken)
               }





            })
}
const popup = () => {
   let priority = d.state();
   let note = d.state();

   let formState=d.state("signup")
   let isActiveLogin=d.derived(()=>formState.value!="login")
   let isActiveSignup=d.derived(()=>formState.value!="signup")
   return d.dialog(
      { open: "" },
      d.article(
         d.header(
            d.button({ ariaLabel: "close", rel: "prev" }),
            d.p(d.strong(formState))
         ),
         d.p("to use the app you have to create an AW account"),
         d.div({role:'group'},
            d.button("login").on("click",()=>formState.value="login").bindClass(isActiveLogin,"outline"),
            d.button("signup").on("click",()=>formState.value="signup").bindClass(isActiveSignup,"outline"),
                   )
,           loginForm().showIf(()=>formState.value=="login"),
            signUpform().showIf(()=>formState.value=="signup"),


      )
   );
};

const taskItem = (task) => {
   let isDone = d.state(task.done);


   return d
      .li(
         d
            .input({ type: "checkbox", ariaLabel: "complete task " })
            .css({ minWidth: "1.1rem" })
            .bindAttr(isDone, "checked")
            .on("input", (e) => {
               isDone.value = !isDone.value;
      appData.modifyTaskDone(task.id, isDone.value);
            }),
         d.span(task.title).css(() => ({
            textDecoration: isDone.value ? "line-through" : "none",
            opacity: isDone.value ? "0.5" : "1",
            textAlign: "center",
            cursor: "pointer"
         })),
         d
            .button({
               class: "outline",
               ariaLabel: "close",
               title: "remove task"
            })
            .html(
               `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z"/>
      </svg>`
            )
            .on("click", () => {
               appData.removeTask(task.id);
            })
            .css({
               padding: "0.3rem",
               display: "inline-flex",
               alignItems: "center",
               justifyContent: "center"
            })
      )
      .css({
         width: "100%",
         display: "flex",
         justifyContent: "space-between",
         alignItems: "center",
         padding: "0.5rem 1rem"
      });
};

const taskarea = () => {
   let tasks = appData.getRef("tasks")

   return d
      .div(
         noTaskMsg().showIf(appData.isTaskEmpty),

         d
            .ul()
            .forEvery(tasks, (task) => {
               console.log(task);
               return taskItem(task);
            })
            .css({
               listStyle: "none",
               padding: "0px",
               paddingTop: "2rem",
               margin: "0px"
            })
      )
      .css({
         maxHeight: "77vh",
         overflow: "auto",
         marginBottom: "8rem"
      });
};

const taskForm = () => {
   let tname = d.state("");
   return d.div(
   d.div(
            d.button("suggest tasks",{
                class:'outline'
            }).css({
            marginBottom:'1rem',
            background:'rgba(255,255,255,0.5)',
            backdropFilter:'blur(5px)',
            padding:'0.18rem 0.8rem',
            borderRadius:'5rem'

        }).on("click",(e)=>{
            e.preventDefault()
                e.stopPropagation()
}).showIf(tname)
    ).css({
        width:'100%'
        ,display:'flex',
        justifyContent:'center'
    })
,    
    d
      .form(
         d.fieldset(
            { role: "group" },
            d
               .input({
                  type: "text",
                  ariaLabel: "taskname field",
                  placeHolder: "enter task",
                  autocomplete: "off"
               })
               .model(tname),
            d.input({
               type: "submit",
               value: "add task"
            })
         )
      )
      .on("submit", (e) => {
         e.preventDefault();
         appData.addTask({ name: tname.value });
         tname.value = "";
      }))
      .css({
         position: "fixed",
         bottom: "0",
         width: "90%",
         left: "50%",
         translate: "-50%",
         padding: "0rem 0rem"
      });
};

const app = () => {
   let isLoggedIn=appData.getRef("isLoggedIn")
   return d
      .div(
         popup().showIf(()=>!isLoggedIn.value),
         header(),

         taskarea(),
         taskForm()
      )
      .css({
         position: "relative",
         width: "100%",
         padding: "2rem",
         paddingTop: "0px"
      });
};


app().addTo(document.body)