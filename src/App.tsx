import React, {useMemo, useState} from 'react';
import './App.css';

const Mine = -1
const minesQuantity = 5;
const size = 16;
const minesQuantityArray = [
    '/sprites/fieldButtons/pressBtnBack.png',
    '/sprites/minesQuantityButtons/numberOne.png',
    '/sprites/minesQuantityButtons/numberTwo.png',
    '/sprites/minesQuantityButtons/numberThree.png',
    '/sprites/minesQuantityButtons/numberFour.png',
    '/sprites/minesQuantityButtons/numberFive.png',
    '/sprites/minesQuantityButtons/numberSix.png',
    '/sprites/minesQuantityButtons/numberSeven.png',
    '/sprites/minesQuantityButtons/numberEight.png'
];
const numerals = [
    'url(/sprites/numerals/zero.png)',
    'url(/sprites/numerals/one.png)',
    'url(/sprites/numerals/two.png)',
    'url(/sprites/numerals/three.png)',
    'url(/sprites/numerals/four.png)',
    'url(/sprites/numerals/five.png)',
    'url(/sprites/numerals/six.png)',
    'url(/sprites/numerals/seven.png)',
    'url(/sprites/numerals/eight.png)',
    'url(/sprites/numerals/nine.png)'
]
function fieldConstructor (size: number): number[] {

  function getMinesAmount(x: number, y: number){
        if(x >= 0 && x < size && y >= 0 && y < size){
            if(field[y*size+x] === Mine) return;
            field[y*size+x] += 1;
        }
  }

  const field: number[] = new Array(size*size).fill(0);

  for(let i=0; i<minesQuantity;){
    const x = Math.floor(Math.random()*size);
    const y = Math.floor(Math.random()*size);

    if(field[y*size+x] === Mine) continue;
    else field[y*size+x] = Mine;

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
    [Mask.Start] : <button className = 'startCell' style={{backgroundImage: `url(/sprites/fieldButtons/btnBack.png)`}}></button>,
    [Mask.ValueMask] : null,
    [Mask.Flag] : <button className = 'startCell' style={{backgroundImage: `url(/sprites/fieldButtons/flagBtnBack.png)`}}></button>,
    [Mask.Question] : <button className = 'startCell' style={{backgroundImage: 'url(/sprites/fieldButtons/questBtn.png)'}}></button>,
    [Mask.BombExploded] : <button className = 'startCell' style={{backgroundImage: 'url(/sprites/fieldButtons/blownMineBtn.png)'}}></button>,
    [Mask.FoundedMine] : <button className = 'startCell' style={{backgroundImage: 'url(/sprites/fieldButtons/foundMineBtn.png)'}}></button>
}

const App = () => {
    const iterator = new Array(size).fill(null);
    const [field, setField] = useState<number[]>(() => fieldConstructor(size));
    const [mask, setMask] = useState<Mask[]>(() => new Array(size*size).fill(Mask.Start))
    const [loss, setLoss] = useState<boolean>(false);
    const [smile, setSmile] = useState<string>('url(/sprites/smileButtons/smileBack.png)');
    const [flagsQuantity, setFlagsQuantity] = useState<number>(minesQuantity);
    const [seconds, setSeconds ] = useState<number>(0);
    const [timerActive, setTimerActive ] = useState<boolean>(false);

    React.useEffect(() => {
        if (seconds < 999 && timerActive) {
            setTimeout(setSeconds, 1000, seconds + 1);
            console.log(seconds);
        }
        else {
            setTimerActive(false);
            setSeconds(0);
        }
    }, [ seconds, timerActive ]);

    const win = useMemo(() => !field.some(
            (f, i) =>
                f === Mine && mask[i] !== Mask.Flag
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

    return (
        <div className='container'>
            <div className='menu'>
                <div className='flagsQuality'>
                    <div className={'numeralValue'} style={{backgroundImage: numerals[Math.trunc(flagsQuantity/100)]}}></div>
                    <div className={'numeralValue'} style={{backgroundImage: numerals[Math.trunc((flagsQuantity/10)%10)]}}></div>
                    <div className={'numeralValue'} style={{backgroundImage: numerals[flagsQuantity%10]}}></div>
                </div>
                <button className='mainButton'
                        onMouseDown={() => {{setSmile('url(/sprites/smileButtons/pressSmileBack.png)')}}}
                        onMouseUp={() => {{setSmile('url(/sprites/smileButtons/smileBack.png)')}}}
                        onClick={() => {
                            setSeconds(0);
                            setField(fieldConstructor(size));
                            setMask(new Array(size*size).fill(Mask.Start));
                            setTimerActive(false);
                            setFlagsQuantity(minesQuantity);
                            setLoss(false);
                        }}
                        style={{backgroundImage:
                        loss ? 'url(/sprites/smileButtons/deadSmileBack.png)':
                        win ? 'url(/sprites/smileButtons/coolSmileBack.png)':
                            smile
                }}></button>
                <div className={'timer'}>
                    <div className={'numeralValue'} style={{backgroundImage: numerals[Math.trunc(seconds/100)]}}></div>
                    <div className={'numeralValue'} style={{backgroundImage: numerals[Math.trunc((seconds/10)%10)]}}></div>
                    <div className={'numeralValue'} style={{backgroundImage: numerals[seconds%10]}}></div>
                </div>
            </div>
            {iterator.map((_, y) => {
                return(<div key = {y} className='field'>
                    {iterator.map((_, x) => {
                        return (<div
                            key = {x}
                            onClick={() => {
                                setSeconds(0);
                                setTimerActive(true);
                                if(mask[y*size+x] === Mask.ValueMask
                                    || mask[y*size+x] === Mask.BombExploded
                                    || mask[y*size+x] === Mask.FoundedMine
                                ) return;
                                const cleaning: [number, number][] = [];
                                function clean(x: number, y: number){
                                    if(x >= 0 && x < size && y >= 0 && y < size){
                                        if(mask[(y)*size+(x)] === Mask.ValueMask) return;
                                        cleaning.push([x, y]);
                                    }
                                }

                                clean(x, y);

                                while (cleaning.length){
                                    const [x, y] = cleaning.pop()!!;
                                    mask[y*size+x] = Mask.ValueMask;
                                    if(field[y*size+x] !== 0) continue;
                                    clean(x+1, y);
                                    clean(x-1, y);
                                    clean(x, y+1);
                                    clean(x, y-1);
                                }

                                if(field[y*size+x] === Mine ){
                                    mask.forEach((_,i) => {
                                        if(mask[i] === Mask.Flag) mask[i] = Mask.FoundedMine;
                                        else mask[i] = Mask.ValueMask;
                                    });
                                    mask[y*size+x] = Mask.BombExploded;
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
                                    if(mask[y*size+x] === Mask.Start && flagsQuantity > 0) {
                                        mask[y*size+x] = Mask.Flag;
                                        setFlagsQuantity(flagsQuantity-1);
                                    }
                                    else if(mask[y*size+x] === Mask.Flag){
                                        mask[y*size+x] = Mask.Question;
                                    }
                                    else if(mask[y*size+x] === Mask.Question){
                                        mask[y*size+x] = Mask.Start;
                                        setFlagsQuantity(flagsQuantity+1);
                                    }
                                }
                                setMask((prev) => [...prev]);
                            } }
                            onMouseDown={() => {
                                if(mask[y*size+x] === Mask.Start){
                                    setSmile('url(/sprites/smileButtons/frightSmileBack.png)')
                                }
                            }}
                            onMouseUp={() => {setSmile('url(/sprites/smileButtons/smileBack.png)')}}
                        >{
                            mask[y*size+x] !== Mask.ValueMask ?
                                maskToView[mask[y*size+x]]:
                                field[y*size+x] === Mine ?
                                    <button className ='mineBtn' style={{backgroundImage: `url(/sprites/fieldButtons/mineBtn.png)`}}>K</button> :
                                    <button className = 'simpleCell' style={{backgroundImage: `url(${minesQuantityArray[field[y*size+x]]})`}}></button>
                        }</div>);
                    })}
                </div>);
            })}
        </div>
    );
};

export default App;