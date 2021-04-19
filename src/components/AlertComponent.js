import React, { useState } from 'react';

const { forwardRef, useImperativeHandle } = React;

export const AlertComponent = forwardRef((props, ref) => {

    const [showAlert, setShowAlert] = useState(false);
    const [text, setText] = useState('');

    useImperativeHandle(ref, () => ({

        mostarAlert(_text) {
            setShowAlert(true);
            setText(_text);
            setTimeout(() => {
                setShowAlert(false);
            }, 5000);
        }

    }));

    return (

        <div role="alert" className={showAlert ? "fixed z-40 xl:w-2/12 mx-auto sm:mx-0 sm:w-2/3 md:w-3/5 justify-between w-11/12 bg-gray-300 shadow-lg rounded flex sm:flex-row flex-col left-0 sm:left-auto dark:bg-gray-800 right-0 sm:top-0 sm:mr-6 mt-16 sm:mt-6 mb-6 sm:mb-0 transition duration-150 ease-in-out translate-show" : "translate-hide"}>
            <div className="flex flex-col justify-center px-4 sm:px-2 xl:pl-4 pt-4 sm:pb-4 ml-2">
                <p className="text-sm dark:text-gray-400 font-bold">{text}</p>
            </div>
            <style>
                {`
                .translate-show{
                    transform : translateX(0%);
                }
                .translate-hide{
                    transform : translateX(150%);
                }
                `}
            </style>{" "}
        </div>

    )
});
