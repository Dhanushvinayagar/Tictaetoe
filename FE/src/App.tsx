import { useState } from 'react';
import './App.css'
import Leaderboard from './pages/Leaderboard';
import Game from './pages/Game';
import Nickname from './pages/Nickname';
import Matcher from './pages/Matcher';


function App() {

    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [match, setMatch] = useState<any>(null);
  
    if (step === 1) return <Nickname name={name} setName={setName} onNext={(_:any) => setStep(2)} />;
    if (step === 2) return <Matcher name={name} onMatch={(m:any)=>{setStep(3); setMatch(m);}} />;
    if (step === 3) return <Game details={match} />;
  
    return <Leaderboard />;

}

export default App
