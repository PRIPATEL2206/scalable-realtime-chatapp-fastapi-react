'use client'
import { tost } from "@/hooks/tost-provider";

export default function Home() {
  const showTost = ()=>{
    tost.sucsess("ok")
  }
  return (
    <main className="flex justify-center" >
    
      <button  onClick={showTost}>ok</button>
    </main>
  );
}
