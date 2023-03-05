import React, {useMemo, useState} from 'react';
import './App.css';
import FlagsQuality from "./Components/flagsQuality/FlagsQuality";
import TimerApp from "./Components/timer/TimerApp";
import MainButton from "./Components/mainButton/MainButton";

const mine = -1
const minesQuantity = 5;
const sizeField = 16;
const fieldButtonsPath = '/sprites/fieldButtons/';
const minesQuantityPath = '/sprites/minesQuantityButtons/';
const numeralsPath = 'url(/sprites/numerals/';
const minesQuantityArray = [
    fieldButtonsPath + 'pressBtnBack.png',
    minesQuantityPath + 'numberOne.png',
    minesQuantityPath + 'numberTwo.png',
    minesQuantityPath + 'numberThree.png',
    minesQuantityPath + 'numberFour.png',
    minesQuantityPath + 'numberFive.png',
    minesQuantityPath + 'numberSix.png',
    minesQuantityPath + 'numberSeven.png',
    minesQuantityPath + 'numberEight.png'
];
const numerals = [
    numeralsPath + 'zero.png)',
    numeralsPath + 'one.png)',
    numeralsPath + 'two.png)',
    numeralsPath + 'three.png)',
    numeralsPath + 'four.png)',
    numeralsPath + 'five.png)',
    numeralsPath + 'six.png)',
    numeralsPath + 'seven.png)',
    numeralsPath + 'eight.png)',
    numeralsPath + 'nine.png)'
]
function fieldConstructor (size: number): number[] {

  function getMinesAmount(x: number, y: number){
        if(x >= 0 && x < size && y >= 0 && y < size){
            if(field[y*size+x] === mine) return;
            field[y*size+x] += 1;
        }
  }

  const field: number[] = new Array(size*size).fill(0);

  for(let i=0; i<minesQuantity;){
    const x = Math.floor(Math.random()*size);
    const y = Math.floor(Math.random()*size);

    if(field[y*size+x] === mine) continue;
    else field[y*size+x] = mine;

    i += 1;

    getMinesAmount(x + 1 , y);
    getMinesAmount(x - 1, y);
    getMinesAmount(x, y + 1);
    getMinesAmount(x, y - 1);
    getMinesAmount(x + 1, y - 1);
    getMinesAmount(x - 1, y - 1);
    getMinesAmount(x + 1, y + 1);
    getMinesAmount(x - 1, y + 1);
  }


  return field;
}

enum Mask{
    Start,
    ValueMask,
    Flag,
    Question,
    BombExploded,
    FoundedMine
}

const maskToView: Record<Mask, React.ReactNode> = {
    [Mask.Start]: (
        <button
            className="startCell"
            style={{ backgroundImage: `url(/sprites/fieldButtons/btnBack.png)` }}
        ></button>
    ),
    [Mask.ValueMask]: null,
    [Mask.Flag]: (
        <button
            className="startCell"
            style={{ backgroundImage: `url(/sprites/fieldButtons/flagBtnBack.png)` }}
        ></button>
    ),
    [Mask.Question]: (
        <button
            className="startCell"
            style={{ backgroundImage: "url(/sprites/fieldButtons/questBtn.png)" }}
        ></button>
    ),
    [Mask.BombExploded]: (
        <button
            className="startCell"
            style={{ backgroundImage: "url(/sprites/fieldButtons/blownMineBtn.png)" }}
        ></button>
    ),
    [Mask.FoundedMine]: (
        <button
            className="startCell"
            style={{ backgroundImage: "url(/sprites/fieldButtons/foundMineBtn.png)" }}
        ></button>
    ),
};

const App = () => {
    const iterator = new Array(sizeField).fill(null);
    const [field, setField] = useState<number[]>(() => fieldConstructor(sizeField));
    const [mask, setMask] = useState<Mask[]>(() => new Array(sizeField*sizeField).fill(Mask.Start))
    const [loss, setLoss] = useState<boolean>(false);
    const [smile, setSmile] = useState<string>('url(/sprites/smileButtons/smileBack.png)');
    const [flagsQuantity, setFlagsQuantity] = useState<number>(minesQuantity);
    const [seconds, setSeconds ] = useState<number>(0);
    const [timerActive, setTimerActive ] = useState<boolean>(false);

    const win = useMemo(() => !field.some(
            (f, i) =>
                f === mine && mask[i] !== Mask.Flag
                && mask[i] !== Mask.ValueMask
        ),
        [field, mask],
    );

    if(win){
        mask.forEach((_,i) => {
            if(mask[i] === Mask.Flag) mask[i] = Mask.FoundedMine;
            else mask[i] = Mask.ValueMask;
        });
    }

    React.useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (timerActive && !win) {
            interval = setInterval(
                () =>
                    setSeconds((prev) => {
                        if (prev === 998) {
                            setTimerActive(false);
                            setLoss(true);
                            mask.forEach((_, i) => {
                                if (mask[i] === Mask.Flag) mask[i] = Mask.FoundedMine;
                                else mask[i] = Mask.ValueMask;
                            });
                        }
                        return ++prev;
                    }),
                1000
            );
        }
        return () => {
            interval && clearInterval(interval);
        };
    }, [timerActive, win]);

    return (
        <div className='container'>
            <div className='menu'>
                <FlagsQuality
                    numerals={numerals}
                    flagsQuantity={flagsQuantity}
                />
                <MainButton
                    setSeconds={setSeconds}
                    setSmile={setSmile}
                    setField={setField}
                    setMask={setMask}
                    setTimerActive={setTimerActive}
                    setFlagsQuantity={setFlagsQuantity}
                    setLoss={setLoss}
                    sizeField={sizeField}
                    minesQuantity={minesQuantity}
                    loss={loss}
                    win={win} smile={smile}
                    fieldConstructor={fieldConstructor}
                />
                <TimerApp
                    numerals={numerals}
                    seconds={seconds}
                />
            </div>
            {iterator.map((_, y) => {
                return(<div key = {y} className='field'>
                    {iterator.map((_, x) => {
                        return (<div
                            key = {x}
                            onClick={() => {
                                setTimerActive(true);
                                if(mask[y*sizeField+x] === Mask.ValueMask
                                    || mask[y*sizeField+x] === Mask.BombExploded
                                    || mask[y*sizeField+x] === Mask.FoundedMine
                                ) return;
                                const cleaning: [number, number][] = [];
                                function clean(x: number, y: number){
                                    if(x >= 0 && x < sizeField && y >= 0 && y < sizeField){
                                        if(mask[(y)*sizeField+(x)] === Mask.ValueMask) return;
                                        cleaning.push([x, y]);
                                    }
                                }

                                clean(x, y);

                                while (cleaning.length){
                                    const [x, y] = cleaning.pop()!!;
                                    mask[y*sizeField+x] = Mask.ValueMask;
                                    if(field[y*sizeField+x] !== 0) continue;
                                    clean(x+1, y);
                                    clean(x-1, y);
                                    clean(x, y+1);
                                    clean(x, y-1);
                                }

                                if(field[y*sizeField+x] === mine ){
                                    mask.forEach((_,i) => {
                                        if(mask[i] === Mask.Flag) mask[i] = Mask.FoundedMine;
                                        else mask[i] = Mask.ValueMask;
                                    });
                                    mask[y*sizeField+x] = Mask.BombExploded;
                                    setLoss(true);
                                    setTimerActive(false);
                                }

                                setMask((prev) => [...prev]);
                            }}
                            onContextMenu={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setTimerActive(true);
                                if(!win && !loss){
                                    if(mask[y*sizeField+x] === Mask.Start && flagsQuantity > 0) {
                                        mask[y*sizeField+x] = Mask.Flag;
                                        setFlagsQuantity(flagsQuantity-1);
                                    }
                                    else if(mask[y*sizeField+x] === Mask.Flag){
                                        mask[y*sizeField+x] = Mask.Question;
                                    }
                                    else if(mask[y*sizeField+x] === Mask.Question){
                                        mask[y*sizeField+x] = Mask.Start;
                                        setFlagsQuantity(flagsQuantity+1);
                                    }
                                }
                                setMask((prev) => [...prev]);
                            } }
                            onMouseDown={() => {
                                if(mask[y*sizeField+x] === Mask.Start){
                                    setSmile('url(/sprites/smileButtons/frightSmileBack.png)')
                                }
                            }}
                            onMouseUp={() => {setSmile('url(/sprites/smileButtons/smileBack.png)')}}
                        >{
                            mask[y*sizeField+x] !== Mask.ValueMask ?
                                maskToView[mask[y*sizeField+x]]:
                                field[y*sizeField+x] === mine ?
                                    <button className ='mineBtn' style={{backgroundImage: `url(/sprites/fieldButtons/mineBtn.png)`}}>K</button> :
                                    <button className = 'simpleCell' style={{backgroundImage: `url(${minesQuantityArray[field[y*sizeField+x]]})`}}></button>
                        }</div>);
                    })}
                </div>);
            })}
        </div>
    );
};

export default App;