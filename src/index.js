import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { MultaTableComponent } from './components/MultaTableComponent';

import BasicLayoutComponent from './layout/BasicLayoutComponent';

ReactDOM.render(

  <BasicLayoutComponent>
    <MultaTableComponent></MultaTableComponent>
  </BasicLayoutComponent>,
  
  document.getElementById('root')
);

