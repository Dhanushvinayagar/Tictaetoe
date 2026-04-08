import { useEffect } from "react";

export default function Nickname({ name , setName, onNext }: any) {

  useEffect(() => {
    const nick_name = localStorage.getItem("ticktacktoe_name");
    if (nick_name){
      setName(nick_name);
    }
  },[])

  return (
    <div>
      <h2>Who are you?</h2>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={() =>{
        localStorage.setItem("ticktacktoe_name", name);
        onNext()
      }
      }>Continue</button>
    </div>
  );
}