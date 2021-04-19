import React, { useState, useRef } from "react";
import Config from '../config';
import { AlertComponent } from "./AlertComponent";


const { forwardRef, useImperativeHandle } = React;

export const MultaModalComponent = forwardRef((props, ref) => {

  const childRef = useRef();
  const [modalShow, setModalShow] = useState(false);
  const [multa, setMulta] = useState();
  const [color, setColor] = useState();
  const [inputValue, setInputValue] = useState('');


  useImperativeHandle(ref, () => ({

    openModal(_multa) {
      setModalShow(true);
      setMulta(_multa);
      setColor(_multa.registro_de_multas_impagas === 0 ? '' : 'bg-red-600 px-2 py-1 my-2 text-white rounded-md');
    }

  }));

  const pagarMulta = async () => {
    //NOTA: Seria bueno haber hecho validaciones en frontal pero como ya se han hecho en brack, solo 
    const url = `${Config.server}/multas/${multa.patente}/pagar`;
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valor: inputValue
      })
    });
    
    if(resp.ok){
      const { data } = await resp.json();
      setMulta(data);
      setInputValue('');
      setColor(data.registro_de_multas_impagas === 0 ? '' : 'bg-red-600 px-2 py-1 my-2 text-white rounded-md');
      props.recargarTabla();
      childRef.current.mostarAlert('Pago realizado correctamente');
    } else {
      const { errorMessage } = await resp.json();
      childRef.current.mostarAlert(errorMessage.valor? errorMessage.valor : errorMessage);
    }
  }

  const cursarMulta = async () => {
    const url = `${Config.server}/multas/${multa.patente}/cursar`;
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        valor: inputValue
      })
    });
    
    if(resp.ok){
      const { data } = await resp.json();
      setMulta(data);
      setInputValue('');
      setColor(data.registro_de_multas_impagas === 0 ? '' : 'bg-red-600 px-2 py-1 my-2 text-white rounded-md');
      props.recargarTabla();
      childRef.current.mostarAlert('Multa cursada correctamente');
    } else {
      const { errorMessage } = await resp.json();
      
      childRef.current.mostarAlert(errorMessage.valor? errorMessage.valor : errorMessage);
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }

  return (

    <>
      <AlertComponent ref={childRef}></AlertComponent>
      {
        modalShow && (
          <div>
            <div className="py-12 bg-gray-700 opacity-20 transition duration-150 ease-in-out z-10 fixed top-0 right-0 bottom-0 left-0 overflow-hidden"></div>
            <div className="py-12 transition duration-150 ease-in-out z-10 fixed top-0 right-0 bottom-0 left-0 overflow-hidden" id="modal">
              <div role="alert" className="container mx-auto w-11/12 md:w-7/12 max-w-lg">
                <div className="relative py-8 px-5 md:px-10 bg-white shadow-md rounded border border-gray-400">
                  <div className="w-full flex items-center text-green-400 mb-3">
                    <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight uppercase">Datos multa patente: {multa.patente}</h1>
                  </div>

                  <div className="flex items-center" style={{ fontFamily: '"Lato", sans-serif' }}>


                    <div className="flex flex-col py-8 px-4">

                      <div className="flex flex-col mb-2">
                        <span className="text-gray-800 dark:text-gray-100 text-sm font-extrabold leading-tight tracking-normal mb-2">{multa.vehiculo}</span>

                        <span className="text-gray-800 dark:text-gray-100 text-sm leading-tight tracking-normal mb-2">Valor permiso: ${multa.valor_permiso}</span>
                        <span className="text-gray-800 dark:text-gray-100 text-sm leading-tight tracking-normal mb-2">Intereses y reajustes: ${multa.interes_y_reajuste}</span>

                        <span className="text-gray-800 dark:text-gray-100 text-sm leading-tight tracking-normal mb-2">Multas impagas: <span className={color}>${multa.registro_de_multas_impagas}</span></span>
                      </div>

                      <div className="flex flex-col mb-2">
                        <span className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2">Total a pagar: ${multa.subtotal}</span>
                      </div>

                      <div className="flex flex-col mb-2">
                        <label htmlFor="valor" className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2">
                          Valor
                          {
                            
                          }
                          <span className="ml-2 p-1 rounded-full hover:text-white bg-blue-100 hover:bg-blue-500" title="Ingrese un monto y luego haga click en el botón pagar o multar. Puede pagar el total de la deuda o solo una fracción, en caso de pagar parte, se descontara primero el interés y reajuste luego se descontara lamulta y al final se descontara el permiso">?</span>
                        </label>
                        <input id="valor" type="text" value={inputValue} onChange={handleInputChange} className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-blue-700 dark:focus:border-blue-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow" placeholder="Ingrese el monto" />
                      </div>


                    </div>


                  </div>
                  <div className="flex items-center w-full">
                    
                    <button onClick={pagarMulta} className="focus:outline-none transition duration-150 ease-in-out hover:bg-blue-600 bg-blue-700 rounded text-white px-8 py-2 text-xs sm:text-sm">Pagar</button>
                    <button onClick={cursarMulta} className="focus:outline-none ml-3 transition duration-150 ease-in-out hover:bg-red-600 bg-red-700 rounded text-white px-8 py-2 text-xs sm:text-sm">Multar</button>
                    <button className="focus:outline-none ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-4 sm:px-8 py-2 text-xs sm:text-sm" onClick={() => { setModalShow(false) }}>Cancelar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

    </>

  );
});