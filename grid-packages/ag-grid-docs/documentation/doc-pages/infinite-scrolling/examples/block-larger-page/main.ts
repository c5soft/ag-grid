import {ColDef, Grid, GridOptions, ICellRendererParams, IDatasource, IGetRowsParams, SortModelItem} from '@ag-grid-community/core'

declare function countries(): string[];

const filterParams = {values: countries()};
const columnDefs: ColDef[] = [
    // this row just shows the row index, doesn't use any data from the row
    {
        headerName: 'ID',
        maxWidth: 100,
        valueGetter: 'node.id',
        cellRenderer: function (params: ICellRendererParams) {
            if (params.value !== undefined) {
                return params.value
            } else {
                return '<img src="https://www.ag-grid.com/example-assets/loading.gif">'
            }
        },
        // we don't want to sort by the row index, this doesn't make sense as the point
        // of the row index is to know the row index in what came back from the server
        sortable: false,
        suppressMenu: true,
    },
    {headerName: 'Athlete', field: 'athlete', suppressMenu: true},
    {
        field: 'age',
        filter: 'agNumberColumnFilter',
        filterParams: {
            filterOptions: ['equals', 'lessThan', 'greaterThan'],
        },
    },
    {
        field: 'country',
        filter: 'agSetColumnFilter',
        filterParams: filterParams,
    },
    {
        field: 'year',
        filter: 'agSetColumnFilter',
        filterParams: {values: ['2000', '2004', '2008', '2012']},
    },
    {field: 'date'},
    {field: 'sport', suppressMenu: true},
    {field: 'gold', suppressMenu: true},
    {field: 'silver', suppressMenu: true},
    {field: 'bronze', suppressMenu: true},
    {field: 'total', suppressMenu: true},
]

const gridOptions: GridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
        flex: 1,
        minWidth: 150,
        sortable: true,
        resizable: true,
        floatingFilter: true,
    },
    rowSelection: 'multiple',
    rowModelType: 'infinite',
    cacheBlockSize: 100,
    cacheOverflowSize: 2,
    maxConcurrentDatasourceRequests: 2,
    infiniteInitialRowCount: 1,
    maxBlocksInCache: 2,
    pagination: true,
    paginationAutoPageSize: true,
    // debug: true,
    getRowNodeId: function (item) {
        return item.id
    },
}

function sortAndFilter(allOfTheData: any[], sortModel: SortModelItem[], filterModel: any) {
    return sortData(sortModel, filterData(filterModel, allOfTheData))
}

function sortData(sortModel: SortModelItem[], data: any[]) {
    const sortPresent = sortModel && sortModel.length > 0;
    if (!sortPresent) {
        return data
    }
    // do an in memory sort of the data, across all the fields
    const resultOfSort = data.slice();
    resultOfSort.sort(function (a, b) {
        for (let k = 0; k < sortModel.length; k++) {
            const sortColModel = sortModel[k];
            const valueA = a[sortColModel.colId];
            const valueB = b[sortColModel.colId];
            // this filter didn't find a difference, move onto the next one
            if (valueA == valueB) {
                continue
            }
            const sortDirection = sortColModel.sort === 'asc' ? 1 : -1;
            if (valueA > valueB) {
                return sortDirection
            } else {
                return sortDirection * -1
            }
        }
        // no filters found a difference
        return 0
    })
    return resultOfSort
}

function filterData(filterModel: any, data: any[]) {
    const filterPresent = filterModel && Object.keys(filterModel).length > 0;
    if (!filterPresent) {
        return data
    }

    const resultOfFilter = [];
    for (let i = 0; i < data.length; i++) {
        const item = data[i];

        if (filterModel.age) {
            const age = item.age;
            const allowedAge = parseInt(filterModel.age.filter);
            // EQUALS = 1;
            // LESS_THAN = 2;
            // GREATER_THAN = 3;
            if (filterModel.age.type == 'equals') {
                if (age !== allowedAge) {
                    continue
                }
            } else if (filterModel.age.type == 'lessThan') {
                if (age >= allowedAge) {
                    continue
                }
            } else {
                if (age <= allowedAge) {
                    continue
                }
            }
        }

        if (filterModel.year) {
            if (filterModel.year.values.indexOf(item.year.toString()) < 0) {
                // year didn't match, so skip this record
                continue
            }
        }

        if (filterModel.country) {
            if (filterModel.country.values.indexOf(item.country) < 0) {
                continue
            }
        }

        resultOfFilter.push(item)
    }

    return resultOfFilter
}

// setup the grid after the page has finished loading
document.addEventListener('DOMContentLoaded', function () {
    const gridDiv = document.querySelector<HTMLElement>('#myGrid')!;
    new Grid(gridDiv, gridOptions)

    fetch('https://www.ag-grid.com/example-assets/olympic-winners.json')
        .then(response => response.json())
        .then(function (data) {
            data.forEach(function (d: any, index: number) {
                d.id = 'R' + (index + 1)
            })

            const dataSource: IDatasource = {
                rowCount: undefined, // behave as infinite scroll
                getRows: function (params: IGetRowsParams) {
                    console.log('asking for ' + params.startRow + ' to ' + params.endRow)
                    // At this point in your code, you would call the server.
                    // To make the demo look real, wait for 500ms before returning
                    setTimeout(function () {
                        // take a slice of the total rows
                        const dataAfterSortingAndFiltering = sortAndFilter(
                            data,
                            params.sortModel,
                            params.filterModel
                        );
                        const rowsThisPage = dataAfterSortingAndFiltering.slice(
                            params.startRow,
                            params.endRow
                        );
                        // if on or after the last page, work out the last row.
                        let lastRow = -1;
                        if (dataAfterSortingAndFiltering.length <= params.endRow) {
                            lastRow = dataAfterSortingAndFiltering.length
                        }
                        // call the success callback
                        params.successCallback(rowsThisPage, lastRow)
                    }, 500)
                },
            };

            gridOptions.api!.setDatasource(dataSource)
        })
})
