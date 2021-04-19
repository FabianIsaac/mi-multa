import React, { useState, useEffect, useRef } from "react";
import {MultaModalComponent} from "./MultaModalComponent";
import Config from '../config';
import { MultaCreateModalComponent } from "./MultaCreateModalComponent";

export const MultaTableComponent = () => {

  const tablaRef = useRef({ 
    recargar: () => {
      getMultas()
      console.log('deberia cargar')
    } 
  });
  const childRef = useRef(tablaRef);
  const childRef2 = useRef(tablaRef);
  const [multas, setMultas] = useState();
  
  
  useEffect(() => {
    getMultas();
  }, [MultaModalComponent])

  const getMultas = async () => {
    const url = `${Config.server}/multas/`;
    const resp = await fetch(url);
    const { data } = await resp.json();
    setMultas(data);
  }

  

  return (
    <>
      <MultaModalComponent recargarTabla={getMultas} ref={childRef}></MultaModalComponent>
      <MultaCreateModalComponent recargarTabla={getMultas} ref={childRef2}></MultaCreateModalComponent>
      
      { multas && (
        <div className="container mx-auto sm:px-8 max-w-6xl">
          <div className="py-8">
            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4">
              <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal shadow-md border-gray-500 max-h-1.5 animate-fadeIn">
                  <thead className="bg-gray-500 text-white">
                    <tr>
                      <th scope="col" className="px-5 py-3 w-auto border-b border-gray-200 text-sm whitespace-no-wrap uppercase text-center font-normal">PATENTE</th>
                      <th scope="col" className="px-5 py-3 w-auto border-b border-gray-200 text-sm whitespace-no-wrap uppercase text-center font-normal">VEHÍCULO</th>
                      <th scope="col" className="px-5 py-3 w-auto border-b border-gray-200 text-sm whitespace-no-wrap uppercase text-center font-normal">VALOR PERMISO</th>
                      <th scope="col" className="px-5 py-3 w-auto border-b border-gray-200 text-sm whitespace-no-wrap uppercase text-center font-normal">INTERESES Y REAJUSTES</th>
                      <th scope="col" className="px-5 py-3 w-auto border-b border-gray-200 text-sm whitespace-no-wrap uppercase text-center font-normal">REGISTRO DE MULTAS IMPAGAS</th>
                      <th scope="col" className="px-5 py-3 w-auto border-b border-gray-200 text-sm whitespace-no-wrap uppercase text-center font-normal">SUBTOTAL</th>
                      <th scope="col" className="px-5 py-3 w-auto border-b border-gray-200 text-sm whitespace-no-wrap uppercase text-center font-normal">
                      <button onClick={() => {childRef2.current.openModal()}} className="py-1 px-4 text-gray-600 hover:text-gray-100  bg-gray-100 hover:bg-gray-600  focus:ring-gray-500 focus:ring-offset-gray-200 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2">Nuevo</button>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="h-3/5">
                    {
                      multas.map(multa => {
                        const bg = multa.registro_de_multas_impagas === 0 ? '' : 'bg-red-600 px-2 py-1 my-2 text-white rounded-md';
                        return (
                          <tr key={multa.id}>
                            <td className="px-5 py-2 border-b w-auto border-gray-200 bg-gray-50 text-sm">
                              <p className="text-gray-900 whitespace-no-wrap font-bold">{multa.patente}</p>
                            </td>
                            <td className="px-5 py-2 border-b w-auto border-gray-200 bg-gray-50 text-sm">
                              <p className="text-gray-900 whitespace-no-wrap text-xs">{multa.vehiculo}</p>
                            </td>
                            <td className="px-5 py-2 border-b w-auto border-gray-200 bg-gray-50 text-sm text-right">
                              <p className="text-gray-900 whitespace-no-wrap">${multa.valor_permiso}</p>
                            </td>
                            <td className="px-5 py-2 border-b w-auto border-gray-200 bg-gray-50 text-sm text-right">
                              <p className="text-gray-900 whitespace-no-wrap">${multa.interes_y_reajuste}</p>
                            </td>
                            <td className="px-5 py-2 border-b w-auto border-gray-200 bg-gray-50 text-sm text-right">

                              <p className="text-gray-900">
                                <span className={bg}>
                                  ${multa.registro_de_multas_impagas}
                                </span>
                              </p>
                            </td>
                            <td className="px-5 py-2 border-b w-auto border-gray-200 bg-gray-50 text-sm text-right">
                              <p className="text-gray-900 whitespace-no-wrap font-bold">${multa.subtotal}</p>
                            </td>

                            <td className="px-5 py-2 border-b w-auto border-gray-200 bg-gray-50 text-sm text-right">
                              <button onClick={() => {childRef.current.openModal(multa)}} className="py-1 px-4 bg-gray-500 hover:bg-gray-600 focus:ring-gray-500 focus:ring-offset-gray-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2">
                                Acciones
                              </button>
                            </td>
                          </tr>
                        )
                      })
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
