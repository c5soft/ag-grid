'use strict'

import React, {useCallback, useMemo, useRef, useState} from 'react';
import {render} from 'react-dom';
import {AgGridReact} from '@ag-grid-community/react';
import {ClientSideRowModelModule} from '@ag-grid-community/client-side-row-model';
import {SetFilterModule} from '@ag-grid-enterprise/set-filter';
import {MenuModule} from '@ag-grid-enterprise/menu';
import {ColumnsToolPanelModule} from '@ag-grid-enterprise/column-tool-panel';
import {FiltersToolPanelModule} from '@ag-grid-enterprise/filter-tool-panel';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import "@ag-grid-community/core/dist/styles/ag-theme-alpine.css";

const colourCellRenderer = props => {
    if (!props.value || props.value === '(Select All)') {
        return props.value;
    }

    const styles = {
        verticalAlign: "middle",
        border: "1px solid black",
        margin: 3,
        display: "inline-block",
        width: 10,
        height: 10,
        backgroundColor: props.value.toLowerCase()
    };
    return <React.Fragment><div style={styles}/>{props.value}</React.Fragment>;
}

const GridExample = () => {
    const gridRef = useRef();
    const containerStyle = useMemo(() => ({width: '100%', height: '100%'}), []);
    const gridStyle = useMemo(() => ({height: '100%', width: '100%'}), []);
    const [rowData, setRowData] = useState([
            {colour: 'Black'},
            {colour: 'BLACK'},
            {colour: 'black'},
            {colour: 'Red'},
            {colour: 'RED'},
            {colour: 'red'},
            {colour: 'Orange'},
            {colour: 'ORANGE'},
            {colour: 'orange'},
            {colour: 'White'},
            {colour: 'WHITE'},
            {colour: 'white'},
            {colour: 'Yellow'},
            {colour: 'YELLOW'},
            {colour: 'yellow'},
            {colour: 'Green'},
            {colour: 'GREEN'},
            {colour: 'green'},
            {colour: 'Purple'},
            {colour: 'PURPLE'},
            {colour: 'purple'},
        ]
    );
    const modules = useMemo(() => [ClientSideRowModelModule, SetFilterModule, MenuModule, ColumnsToolPanelModule, FiltersToolPanelModule], []);
    const [columnDefs, setColumnDefs] = useState([
        {
            headerName: 'Case Insensitive (default)',
            field: 'colour',
            filter: 'agSetColumnFilter',
            filterParams: {
                caseSensitive: false,
                cellRenderer: colourCellRenderer,
            },
        },
        {
            headerName: 'Case Sensitive',
            field: 'colour',
            filter: 'agSetColumnFilter',
            filterParams: {
                caseSensitive: true,
                cellRenderer: colourCellRenderer,
            },
        },
    ]);
    const defaultColDef = useMemo(() => {
        return {
            flex: 1,
            minWidth: 225,
            cellRenderer: colourCellRenderer,
            resizable: true,
            floatingFilter: true,
        }
    }, []);


    const onFirstDataRendered = useCallback((params) => {
        ((gridRef.current.api.getToolPanelInstance('filters'))).expandFilters();
    }, [])


    return (
        <div style={containerStyle}>
            <div style={{"display": "flex", "flexDirection": "column", "height": "100%"}}>

                <div style={gridStyle} className="ag-theme-alpine">
                    <AgGridReact
                        ref={gridRef}
                        rowData={rowData}
                        modules={modules}
                        columnDefs={columnDefs}
                        defaultColDef={defaultColDef}
                        sideBar={'filters'}
                        onFirstDataRendered={onFirstDataRendered}
                    >
                    </AgGridReact>
                </div>
            </div>
        </div>
    );
}

render(<GridExample></GridExample>, document.querySelector('#root'))
