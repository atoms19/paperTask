self.addEventListener("install",async (e)=>{
    let cache=await caches.open('offline-save')
    await cache.addAll([
        
            '/index.html',
            '/app.js',
            '/components/',// Cache entire folder
            '/resources/', // Cache entire folder
            '/icons/', // Cache entire folder
          
    ])
})

self.addEventListener('fetch' ,async (e)=>{
    try{
      if(!navigator.onLine){
        let response=await caches.match(e.request)
        if (response){
            return response
        }
      }

      let networkRe=await fetch(e.request) //geting response from network
      if(networkRe && networkRe.ok){
      const cache = await caches.open('offline-save'); //saving cache for future
      await cache.put(e.request, networkRe.clone());

      }
      return networkRe
    }catch(err){
        document.write('UNEXPECTED ERROR: PLEASE CONTACT SERVICES')
    }
})