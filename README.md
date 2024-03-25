Styles
===

SWC are by default not using shadow-dom, so your standard 
CSS should work as expected also on the elements created by SWC. 

To enable shadow-dom, you can use the `shadow` attribute on the 
custom element: 

```html
<supabase-table shadow> source="my_table"</supabase-table>
```

If shadow-root is enabled, global styles will not affect the 
elements within the components. 

All components expose a *part* attribute that can be used to
style the internal elements. 

```css
supabase-table::part(container) {
  background-color: #f0f0f0;
}
```
