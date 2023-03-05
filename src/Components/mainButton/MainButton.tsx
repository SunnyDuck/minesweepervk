import React from 'react';
import './MainButton.css';

enum Mask{
    Start,
    ValueMask,
    Flag,
    Question,
    BombExploded,
    FoundedMine
}

interface buttonsProps<T>{
    setSeconds(seconds: number): void;
    setSmile(smile: string): void;
    setField(field: number[]): void;
    setMask(mask: Mask[]): void;
    setTimerActive(timerActive: boolean): void;
    setFlagsQuantity(flagsQuantity: number): void;
    setLoss(loss: boolean): void;
    sizeField: number;
    minesQuantity: number;
    loss: boolean;
    win: boolean;
    smile: string;
    fieldConstructor(sizeField: number) : number[];
}
export default function MainButton<T>(props: buttonsProps<T>) {
    return (
        <div>
            <button className='mainButton'
                    onMouseDown={() => {{props.setSmile('url(/sprites/smileButtons/pressSmileBack.png)')}}}
                    onMouseUp={() => {{props.setSmile('url(/sprites/smileButtons/smileBack.png)')}}}
                    onClick={() => {
                        props.setSeconds(0);
                        props.setField(props.fieldConstructor(props.sizeField));
                        props.setMask(new Array(props.sizeField*props.sizeField).fill(Mask.Start));
                        props.setTimerActive(false);
                        props.setFlagsQuantity(props.minesQuantity);
                        props.setLoss(false);
                    }}
                    style={{backgroundImage:
                            props.loss ? 'url(/sprites/smileButtons/deadSmileBack.png)':
                                props.win ? 'url(/sprites/smileButtons/coolSmileBack.png)':
                                    props.smile
                    }}></button>
        </div>
    );
};
