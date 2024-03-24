Styles
===

SWC are by default not using shadow-dom, so your standard 
CSS should work as expected also on the elements created by SWC. 

To enable shadow-dom, you can use the `shadow` attribute on the 
custom element: 

```html
<supabase-table shadow> source="my_table"</supabase-table>
```


