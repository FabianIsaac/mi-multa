import React, { useState, useRef, useEffect } from "react";
import Config from '../config';
import { AlertComponent } from "./AlertComponent";

const { forwardRef, useImperativeHandle } = React;

export const MultaCreateModalComponent = forwardRef((props, ref) => {

  const childRef = useRef();
  const [modalShow, setModalShow] = useState(false);
  const [modelos, setModelos] = useState();
  const [modeloId, setModeloId] = useState(0)
  const [patente, setPatente] = useState('');

  const [valorPermiso, setValorPermiso] = useState(0);
  const [reajuste, setReajuste] = useState(0)
  const [multa, setMulta] = useState(0)
  const [subtotal, setSubtotal] = useState(0);


  useImperativeHandle(ref, () => ({

    openModal() {
      setModalShow(true);
    }

  }));

  useEffect(() => {
    obtenerModelos();

  }, []);

  const actualizarSubTotal = () => {
    setSubtotal(valorPermiso + multa + reajuste);
  }

  const obtenerModelos = async () => {
    const url = `${Config.server}/modelos`;
    const resp = await fetch(url,);

    if (resp.ok) {
      const { data } = await resp.json();
      setModelos(data);

    } else {
      const { errorMessage } = await resp.json();
      childRef.current.mostarAlert(errorMessage.valor ? errorMessage.valor : errorMessage);
    }
  }

  const handleChangeOption = (e) => {
    setModeloId(e.target.value);
    if (e.target.value != '--') {
      const modelo = modelos.find(modelo => modelo.id == e.target.value);
      setValorPermiso(modelo.valor_permiso);
      setSubtotal(modelo.valor_permiso + multa + reajuste);

    } else {
      setValorPermiso(0);
      setSubtotal(0 + multa + reajuste);
    }
  }

  const handlePatente = (e) => {
    setPatente(e.target.value);
  }

  const handleReajuste = (e) => {

    if (!isNaN(parseInt(e.target.value))) {
      setReajuste(parseInt(e.target.value));
    } else if (e.target.value.length == 0) {
      setReajuste(0);
    }

  }

  const handleMulta = (e) => {
    if (!isNaN(parseInt(e.target.value))) {
      setMulta(parseInt(e.target.value));
    } else if (e.target.value.length == 0) {
      setMulta(0);
    }
  }

  const crearRegistro = async () => {
    
    if(modeloId == 0 || modeloId == '--'){
      childRef.current.mostarAlert('Seleccione un modelo');
      return;
    }

    const modelo = modelos.find(modelo => modelo.id == modeloId);

    const url = `${Config.server}/multas`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        patente: patente,
        vehiculo: modelo.id,
        interes_y_reajuste: reajuste,
        registro_de_multas_impagas: multa,
        subtotal: subtotal
      })
    });

    if (resp.ok) {
      
      childRef.current.mostarAlert('Registro creado correctamente');
      props.recargarTabla();
      resetCampos();
    } else {
      const { errorMessage } = await resp.json();
      let last_error = '';
      for (const error in errorMessage) {
        last_error = errorMessage[error];
      }
      childRef.current.mostarAlert(last_error);
    }

  }

  const resetCampos = () => {
    setModeloId(0);
    setPatente('');
    setValorPermiso(0);
    setReajuste(0);
    setMulta(0);
    setSubtotal(0);
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
                    <h1 className="text-gray-800 font-lg font-bold tracking-normal leading-tight uppercase">Crear nuevo registro de multa</h1>
                  </div>

                  <div className="flex items-center" style={{ fontFamily: '"Lato", sans-serif' }}>


                    <div className="flex flex-col py-8 px-4">
                      {/* Code block starts */}

                      <div className="flex flex-col mb-2">
                        <select value={modeloId} onChange={handleChangeOption}>
                          <option value="--">Seleccione el modelo</option>
                          {
                            modelos.map(modelo => {
                              return <option key={modelo.id} value={modelo.id}>{modelo.vehiculo}</option>
                            })
                          }
                        </select>
                        <span className="text-gray-800 dark:text-gray-100 text-sm font-extrabold leading-tight tracking-normal mb-"></span>

                        <span className="text-gray-800 dark:text-gray-100 text-sm leading-tight tracking-normal mb-3 mt-3">Valor permiso: ${valorPermiso}</span>


                        <span className="text-gray-800 dark:text-gray-100 text-sm leading-tight tracking-normal mb-1">Patente: </span>
                        <input value={patente} onChange={handlePatente} type="text" className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-blue-700 dark:focus:border-blue-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow" placeholder="Ej.: xxxx00" />


                        <span className="text-gray-800 dark:text-gray-100 text-sm leading-tight tracking-normal mb-1 mt-3">Intereses y reajustes: </span>
                        <input value={reajuste} onBlur={actualizarSubTotal} onChange={handleReajuste} type="text" className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-blue-700 dark:focus:border-blue-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow" placeholder="Ingrese el monto" />

                        <span className="text-gray-800 dark:text-gray-100 text-sm leading-tight tracking-normal mb-1 mt-3">Multas impagas:</span>
                        <input value={multa} onBlur={actualizarSubTotal} onChange={handleMulta} type="text" className="text-gray-600 dark:text-gray-400 focus:outline-none focus:border focus:border-blue-700 dark:focus:border-blue-700 dark:border-gray-700 dark:bg-gray-800 bg-white font-normal w-64 h-10 flex items-center pl-3 text-sm border-gray-300 rounded border shadow" placeholder="Ingrese el monto" />
                      </div>

                      <div className="flex flex-col mt-2">
                        <span className="text-gray-800 dark:text-gray-100 text-sm font-bold leading-tight tracking-normal mb-2">Subtotal: ${subtotal}</span>
                      </div>

                      {/* Code block ends */}
                    </div>


                  </div>
                  <div className="flex items-center w-full">
                    <button onClick={crearRegistro} className="focus:outline-none transition duration-150 ease-in-out hover:bg-blue-600 bg-blue-700 rounded text-white px-8 py-2 text-xs sm:text-sm">Crear registro</button>
                    <button className="focus:outline-none ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-4 sm:px-8 py-2 text-xs sm:text-sm" onClick={() => { setModalShow(false); resetCampos() }}>Cancelar</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }

    </>
  )
})
