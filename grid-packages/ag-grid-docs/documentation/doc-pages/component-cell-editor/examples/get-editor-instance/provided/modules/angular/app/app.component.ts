import { Component, OnDestroy } from '@angular/core';
import "@ag-grid-community/core/dist/styles/ag-grid.css";
import "@ag-grid-community/core/dist/styles/ag-theme-alpine.css";
import { MySimpleEditor } from './mySimple-editor.component';
import { ColDef, GridReadyEvent, Module } from '@ag-grid-community/core';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';

@Component({
    selector: 'my-app',
    template: `
      <ag-grid-angular
          style="width: 100%; height: 100%;"
          class="ag-theme-alpine"
          [modules]="modules"
          [columnDefs]="columnDefs"
          [defaultColDef]="defaultColDef"
          [rowData]="rowData"
          (gridReady)="onGridReady($event)">
      </ag-grid-angular>
    `
})
export class AppComponent implements OnDestroy {
    public modules: Module[] = [ClientSideRowModelModule]
    public columnDefs: ColDef[] = [
        {
            field: "first_name",
            headerName: "First Name",
            width: 120,
            editable: true
        },
        {
            field: "last_name",
            headerName: "Last Name",
            width: 120,
            editable: true
        },
        {
            field: "gender",
            width: 100,
            cellEditor: MySimpleEditor
        },
        {
            field: "age",
            width: 80,
            cellEditor: MySimpleEditor
        },
        {
            field: "mood",
            width: 90,
            cellEditor: MySimpleEditor
        },
        {
            field: "country",
            width: 110,
            cellEditor: MySimpleEditor
        },
        {
            field: "address",
            width: 502,
            cellEditor: MySimpleEditor
        }
    ];

    public defaultColDef: ColDef = {
        editable: true,
        sortable: true,
        flex: 1,
        minWidth: 100,
        filter: true,
        resizable: true
    };

    private interval!: number;
    public rowData: any[];

    constructor() {
        this.rowData = this.createRowData();
    }

    onGridReady(params: GridReadyEvent) {
        this.interval = window.setInterval(() => {
            const instances = params.api.getCellEditorInstances();
            if (instances.length > 0) {
                const instance = instances[0] as MySimpleEditor;
                if (instance.myCustomFunction) {
                    const result = instance.myCustomFunction();
                    console.log(`found editing cell: row index = ${result.rowIndex}, column = ${result.colId}.`);
                } else {
                    console.log('found editing cell, but method myCustomFunction not found, must be the default editor.');
                }
            } else {
                console.log('found not editing cell.');
            }
        }, 2000);
    }

    ngOnDestroy() {
        clearInterval(this.interval);
    }

    createRowData() {
        const cloneObject = (obj: any) => JSON.parse(JSON.stringify(obj));

        const students = [
            {
                first_name: 'Bob',
                last_name: 'Harrison',
                gender: 'Male',
                address: '1197 Thunder Wagon Common, Cataract, RI, 02987-1016, US, (401) 747-0763',
                mood: 'Happy',
                country: 'Ireland'
            },
            {
                first_name: 'Mary',
                last_name: 'Wilson',
                gender: 'Female',
                age: 11,
                address: '3685 Rocky Glade, Showtucket, NU, X1E-9I0, CA, (867) 371-4215',
                mood: 'Sad',
                country: 'Ireland'
            },
            {
                first_name: 'Zahid',
                last_name: 'Khan',
                gender: 'Male',
                age: 12,
                address: '3235 High Forest, Glen Campbell, MS, 39035-6845, US, (601) 638-8186',
                mood: 'Happy',
                country: 'Ireland'
            },
            {
                first_name: 'Jerry',
                last_name: 'Mane',
                gender: 'Male',
                age: 12,
                address: '2234 Sleepy Pony Mall , Drain, DC, 20078-4243, US, (202) 948-3634',
                mood: 'Happy',
                country: 'Ireland'
            }
        ];

        students.forEach(item => {
            students.push(cloneObject(item));
        });
        students.forEach(item => {
            students.push(cloneObject(item));
        });
        students.forEach(item => {
            students.push(cloneObject(item));
        });

        return students;
    }
}

