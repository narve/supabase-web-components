Supabase Web Components
===

A set of simple, build-less, framework-agnostic, plain vanilla js web components to get quickly up and running 
with a Supabase frontend. 


Demo
===
https://narve.github.io/supabase-web-components/


Usage
===

```html
    ...
<head>
    ...
    <!-- Not necessary but a class-less stylesheet works nicely with these components ->
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/chimeracss/build/chimera.css"/>

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js"></script>
    <script>
        const supabaseUrl = 'https://xupzhicrqmyvtgztrmjb.supabase.co'
        const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYxMDExNjg5NCwiZXhwIjoxOTI1NjkyODk0fQ.cvK8Il2IbFqU03Q4uOhSQ9jxFkWELLACX7mJKyy_Ue0"
        const client = supabase.createClient(supabaseUrl, supabaseKey)
    </script>

    <script  type="module" src="https://cdn.jsdelivr.net/gh/narve/supabase-web-components/src/supabase-index.js"></script>
</head>
<body>
<supabase-index></supabase-index>
...
```




Style
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
