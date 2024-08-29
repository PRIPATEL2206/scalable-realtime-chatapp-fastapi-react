
const getDataFromFormEvent= (form :React.FormEvent<HTMLFormElement>):any=>{
    const data:any={}
    console.log(Array.from(form.currentTarget.elements))
    for(const e of Array.from(form.currentTarget.elements ) as Array<HTMLInputElement>){
        
        if (e.name){
            data[e.name]=e.value
        }
    }
    return data
}

export {getDataFromFormEvent}