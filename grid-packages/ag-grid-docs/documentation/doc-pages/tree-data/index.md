---
title: "Tree Data"
enterprise: true
---

Use Tree Data to display data that has parent / child relationships where the parent / child relationships are provided
as part of the data. For example, a folder can contain zero or more files and other folders.

This section introduces simple ways to work with Tree Data before covering more advanced use cases.

## Tree Data Mode

In order to set the grid to work with Tree Data, simply enable Tree Data mode via the Grid Options using:

<snippet>
const gridOptions = {
    treeData: true
}
</snippet>

## Supplying Tree Data

When providing tree data to the grid you implement the `gridOptions.getDataPath(data)` callback to tell the grid the hierarchy for each row. The callback returns back a `string[]` with each element specifying a level of the tree. Below follows two examples presenting the hierarchy in different ways.

<api-documentation source='grid-callbacks/callbacks.json' section='groupPivot' names='["getDataPath"]'></api-documentation>

```js
// sample hierarchy, Malcolm is child or Erica
// + Erica
//   - Malcolm

// ############
// Example #1 - hierarchy in the data is already a string array
// ############
const rowData = [
    { orgHierarchy: ['Erica'], jobTitle: "CEO", employmentType: "Permanent" },
    { orgHierarchy: ['Erica', 'Malcolm'], jobTitle: "VP", employmentType: "Permanent" }
    ...
]
// just return the hierarchy, no conversion required
getDataPath: data => {
    return data.orgHierarchy;
}

// ############
// Example #2 - hierarchy is a path string, needs conversion
// ############
const rowData = [
    { path: "Erica", jobTitle: "CEO", employmentType: "Permanent" },
    { path: "Erica/Malcolm", jobTitle: "VP", employmentType: "Permanent" }
    ...
]
// callback converts eg "Erica/Malcolm" to ["Erica","Malcolm"]
getDataPath: data => {
    return data.path.split('/'); // path: "Erica/Malcolm"
}
```

## Configuring Group Column

There are two ways to configure the Group Column:

- **Auto Column Group** - this is automatically selected by the grid when in Tree Data mode, however you can override the defaults.

- **Custom Column Group** - you can provide your own custom column group definition which gives allows more control over how the Group Column is displayed.

### Auto Column Group

When the grid is working with Tree Data there is no need to explicitly specify a Group Column as the grid will use the 
[Auto Group Column](/grouping-single-group-column/#group-column-configuration). However, you will probably want to 
override some defaults as shown below:

<snippet>
const gridOptions = {
    autoGroupColumnDef: {
        headerName: "My Group",
        width: 300,
        cellRendererParams: {
            suppressCount: true
        }
    }
}
</snippet>

### Custom Column Group

As noted above, providing your own Custom Column Group has the advantage of giving you full control over the 
presentation of the Column Group, however it is not as convenient as using the default Auto Column Group.

One significant difference is that the entire `dataPath` array will be supplied as a value, rather than just the current
node value.

For more details see [Custom Group Columns](/grouping-custom-group-columns/)

[[note]]
| It is **not** possible to have multiple group display columns for tree data like you do for row grouping.
| When doing tree data, you should only have one column for display the group.

## Example: Organisational Hierarchy

The following example combines all the steps above to show a simplified organisational hierarchy:

<grid-example title='Org Hierarchy' name='org-hierarchy' type='generated' options='{ "enterprise": true, "exampleHeight": 525, "modules": ["clientside", "rowgrouping"] }'></grid-example>

## Filler Groups

It is not necessary to include entries for each level in the path if data is not required at group levels as shown below:

```js
// all path levels provided
const rowData = [
    { filePath: ['Documents'] },
    { filePath: ['Documents', 'txt'] },
    { filePath: ['Documents', 'txt', 'notes.txt'], dateModified: "21 May 2017, 13:50", size: "14 KB" }
    ...
]

// only leaf level provided
const rowData = [
    { filePath: ['Documents', 'txt', 'notes.txt'], dateModified: "21 May 2017, 13:50", size: "14 KB" }
    ...
]
```

The second variation above leaves out row data entries for 'Documents' and 'txt' nodes, in this case the grid will create `Filler Groups` for these.

This following example includes the column 'Group Type' to highlight which nodes are 'provided' in the row data and which are generated by the grid as a 'filler' group:

<grid-example title='Filler Nodes' name='filler-nodes' type='generated' options='{ "enterprise": true, "exampleHeight": 420, "modules": ["clientside", "rowgrouping"] }'></grid-example>

[[note]]
| As `Filler Groups` are generated by the grid they will not contain a `data` property on the `RowNode`.
| This could be a limitation if you wanted to provide an 'id' for each group even when there is no data displayed at group levels or if you need to filter/sort the `filler nodes`. In order to have filtering/sorting available, please provide all nodes as real nodes from your dataset, instead of using `filler nodes`.

## Tree Data Aggregation

When using Tree Data, columns defined with an aggregation function will always perform aggregations on the group nodes. This means any supplied group data will be ignored in favour of the aggregated values.

However if there are no child nodes to aggregate it will default to the provided value in the row data.

The [File Browser](#example-file-browser) example below demonstrates aggregation
on the 'size' column.

Also you can refer to the section on [Aggregation](/aggregation/) more details.

## Tree Data Filtering

As Tree Data has parent / child relationships, by default all child nodes will be included when a parent passes a filter, and as filtering is performed across all group levels, a group will be included if:

<ol style="list-style-type: lower-latin;">
    <li>it has any children that pass the filter, or</li>
    <li>its data passes the filter</li>
</ol>

To override this behaviour to use regular filtering instead, enable the following Grid Options property:

<snippet>
const gridOptions = {
    excludeChildrenWhenTreeDataFiltering: true,
}
</snippet>

Also note the [Set Filter](/filter-set/) will contain a list of all unique values across each level of the group hierarchy. The [File Browser](#example-file-browser) example below demonstrates how the Set Filter works with Tree Data.

## File Browser Example

The following example presents a more complex example which includes Aggregation and Filtering:

- **'Add New Group' Button** - will add a new group under Music.
- **'Move Selected to stuff' Button** - will move any non parent groups into the 'stuff' folder.
- **'Remove Selected' Button** - will remove selected group along with children.
- **'Files' Filter** - you can filter group and leaf names across the entire file tree.
- **'Size' Aggregation** - as you move selected items into 'stuff' you'll notice updated folder sizes.

<grid-example title='File Browser' name='file-browser' type='generated' options='{ "enterprise": true, "exampleHeight": 570, "extras": ["fontawesome"], "modules": ["clientside", "rowgrouping"] }'></grid-example>

## Pivot and Row Grouping with Tree Data

It is not possible to do pivot or row grouping while using tree data. This means all the functions related to pivot (eg colDef.pivot, or pivot in the tool panel) and row grouping (eg colDef.rowGroup, or row group in the tool panel) will be disabled.

## Child Counts

If you are showing child counts for the groups, then the child count is a count of all children and grand children. This is different to [Row Grouping](/grouping/) where only leaf levels are counted, in tree data, all group children are also counted.

## Selection

To enable selection set `gridOptions.rowSelection` to 'single' or 'multiple' as normal. However there are some restrictions to be aware of.

### Selecting Groups and Children

The property `groupSelectsChildren` does not work with tree data. This is because groups in tree data are rows passed by the application that may or may not have children - a group is simply a normal row that has another row as a child. Given groups and leaf node are logically identical, it is not possible to treat them differently in selection.

If you want to achieve something similar to `groupSelectsChildren` then you should listen on the selection events and do the selection yourself in your application. You will come across edge cases where only your application will understand what the best selection outcome is.

### Checkbox vs Click Selection

Click selection is supported with tree data. However when you are displaying tree data, clicking rows for selection is confusing as mouse clicks are also used for expanding / contracting rows. For this reason we recommend not using click selecting and preferring checkbox selection instead.

<snippet spaceBetweenProperties="true">
|const gridOptions = {
|    // don't have click select rows
|    suppressRowClickSelection: true,
|
|    // have checkbox on the group column
|    autoGroupColumnDef: {
|        cellRendererParams: {
|            checkbox: true,
|        }
|    }
|}
</snippet>

### Group Selection

Filler groups do not keep their selection state should the filler group be moved. For example if you have groups A->B->C, where C is the only row provided (so the grid creates groups A and B for you), and then you change the patch to D->B->C, group B will not keep it's selection.

If keeping selection of groups is a priority, then arrange your data so that the grid does not need to create any filler groups.


## Filtering Aggregations

If Aggregations and Filters are active in the Tree Data, there is one thing to be concerned about. That is that
aggregation values change as filters are applied, which in turn can impact the results of the filter.

This is not a concern when filtering and not using Tree Data, as under normal [Row Grouping](/grouping/) the group
rows (where the aggregations reside) are not filterred on, only leaf rows are filtered on.

However for Tree Data, all rows are filtered on, as all rows are groups (a leaf row is just a group with no children).
For this reason, if you are filtering on a column that has an aggregation active, the aggregated value will be a
moving target as the filter is applied.

To stop the aggregation from been a moving target, you need to set the grid property `suppressAggFilteredOnly=true`.
This is explained in the section [Aggregations](/aggregation/#filtering).
