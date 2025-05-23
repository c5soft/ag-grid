import React, { Component } from 'react';
import { AgGridReact } from '@ag-grid-community/react';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

import "@ag-grid-community/core/dist/styles/ag-grid.css";
import "@ag-grid-community/core/dist/styles/ag-theme-alpine.css";

export default class extends Component {
    constructor(props) {
        super(props);

        const topOptions = {
            alignedGrids: [],
            defaultColDef: {
                editable: true,
                sortable: true,
                resizable: true,
                filter: true,
                flex: 1,
                minWidth: 100
            }
        };
        const bottomOptions = {
            alignedGrids: [],
            defaultColDef: {
                editable: true,
                sortable: true,
                resizable: true,
                filter: true,
                flex: 1,
                minWidth: 100
            }
        };

        topOptions.alignedGrids.push(bottomOptions);
        bottomOptions.alignedGrids.push(topOptions);

        this.state = {
            topOptions,
            bottomOptions,
            columnDefs: [
                { field: 'athlete' },
                { field: 'age' },
                { field: 'country' },
                { field: 'year' },
                { field: 'date' },
                { field: 'sport' },
                {
                    headerName: 'Medals',
                    children: [
                        {
                            columnGroupShow: 'closed', field: "total",
                            valueGetter: "data.gold + data.silver + data.bronze", width: 200
                        },
                        { columnGroupShow: 'open', field: "gold", width: 100 },
                        { columnGroupShow: 'open', field: "silver", width: 100 },
                        { columnGroupShow: 'open', field: "bronze", width: 100 }
                    ]
                }
            ],
            rowData: []
        };
    }

    onGridReady(params) {
        this.topGrid = params;
        fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
            .then(resp => resp.json())
            .then(data => {
                this.setState({
                    rowData: data
                })
            });
    }

    onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
    }

    onCbAthlete(event) {
        // we only need to update one grid, as the other is a slave
        this.topGrid.columnApi.setColumnVisible('athlete', event.target.checked);
    }

    onCbAge(event) {
        // we only need to update one grid, as the other is a slave
        this.topGrid.columnApi.setColumnVisible('age', event.target.checked);
    }

    onCbCountry(event) {
        // we only need to update one grid, as the other is a slave
        this.topGrid.columnApi.setColumnVisible('country', event.target.checked);
    }

    render() {
        return (
            <div className="container">
                <div className="header">
                    <label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            onChange={this.onCbAthlete.bind(this)} />Athlete
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            onChange={this.onCbAge.bind(this)} />Age
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            defaultChecked={true}
                            onChange={this.onCbCountry.bind(this)} />Country
                    </label>
                </div>

                <div className="grid ag-theme-alpine">
                    <AgGridReact
                        rowData={this.state.rowData}
                        gridOptions={this.state.topOptions}
                        columnDefs={this.state.columnDefs}
                        onGridReady={this.onGridReady.bind(this)}
                        onFirstDataRendered={this.onFirstDataRendered.bind(this)}
                        modules={[ClientSideRowModelModule]} />
                </div>

                <div className="grid ag-theme-alpine">
                    <AgGridReact
                        rowData={this.state.rowData}
                        gridOptions={this.state.bottomOptions}
                        columnDefs={this.state.columnDefs}
                        modules={[ClientSideRowModelModule]} />
                </div>
            </div>
        );
    }
}
