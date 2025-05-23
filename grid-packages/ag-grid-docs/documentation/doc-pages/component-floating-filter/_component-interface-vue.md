[[only-vue]]
|## Custom Floating Filter Interface
|
|When a Vue component is instantiated the grid will make the grid APIs, a number of utility methods as well as the cell &
|row values available to you via `this.params`.
|
|The interface for a custom filter component is as follows:
|
|```ts
|interface {
|
|    // Gets called every time the parent filter changes. Your floating
|    // filter would typically refresh its UI to reflect the new filter
|    // state. The provided parentModel is what the parent filter returns
|    // from its getModel() method. The event is the FilterChangedEvent
|    // that the grid fires.
|    onParentModelChanged(parentModel: any, event: FilterChangedEvent): void;
|
|    // Optional methods
|
|    // Gets called when the column is destroyed. If your custom filter needs to do
|    // any resource cleaning up, do it here. A filter is NOT destroyed when it is
|    // made 'not visible', as the GUI is kept to be shown again if the user selects
|    // that filter again. The filter is destroyed when the column it is associated with is
|    // destroyed, either when new columns are set into the grid, or the grid itself is destroyed.
|    destroy?(): void;
|}
|```
|
|### Custom Filter Parameters
|
|When a Vue component is instantiated the grid will make the grid APIs, a number of utility methods as well as the cell & 
|row values available to you via `this.params` - the interface for what is provided is documented below.  
|
|If the user provides params via the `colDef.floatingFilterComponentParams` attribute, these
|will be additionally added to the params object, overriding items of the same name if a name clash exists.
|
