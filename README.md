Supabase Web Components
===

A set of simple, build-less, framework-agnostic, plain vanilla js, html-first web components,
to get quickly up and running with a Supabase frontend. 


Background - motivation
===

Supabase is cool - really cool! But it's also a bit of a hassle to get started with.
Unless you want to commit yourself to a full-blown framework like React, Vue or Angular,
you're pretty much on your own.

This is a set of simple web components that you can use to get started with Supabase 
quickly. No build process, no npm, no webpack, no nothing. Just include the script and 
a few tags, and you are ready to go.

The components are built with the Custom Elements API (lit, to be precise), and are framework-agnostic.

The components are not meant to be a full-blown solution, but rather a starting point. 


Status - is this ready for production?
===

Probably not, but it's a start.


Getting started
===

0. Set up your Supabase account, create or reuse a project, and get your (public) API key 
   and site URL. 

1. Include the script in your html file

```html
<script  type="module" src="https://cdn.jsdelivr.net/gh/narve/supabase-web-components/src/supabase-index.js"></script>
```

2. Add the connection element to your html file

```html
    <supabase-connect
        title="MyAppServer"
        url="https://my-project-id.supabase.co"
        key="my-public-api-key"
    ></supabase-connect>
```

   Recommended: Add a toast-element, then you will get toast-style notifications 
   when the connection is established, user is logged in, if error occurs, etc. 
    
```html
    <cb-toast></cb-toast>
```    

3. Add your first table (or view) to the page (this needs to be accessible without logging in). 
   This will create a table view showing all columns, sortable, and (optionally) with actions for 
   adding, editing and deleting records. 

```html
    <supabase-table 
        source="my_table_or_view"
    >
    
    <!-- Optional: Add an item editor (below the table) -->
    <supabase-item-editor></supabase-item-editor>
</supabase-table>
```


4. Open/serve your html page. Local file urls (e.g. double-clicking the html-file in the file explorer),
   will not work, due to brower security, 
   but most IDEs (like Webstorm) lets you open your file with a built-in server.
   Or you can use any simple web-server, e.g. `python -m http.server` or `npx http-server`.

5. Then see the rest of the components to create a login/registration form, etc


Get a full site immediately
===

Using the `supase-site` element, you can get a full site up and running immediately. 
It will list all available resources, and provide table views for each table/view, 
with functionality to add, edit and delete records, logging in etc. Great to 
get started quickly. 

```html
    <supabase-site></supabase-site>
```


Demo
===
https://narve.github.io/supabase-web-components/


```html
    <supabase-site></supabase-site>

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
<supabase-site></supabase-site>
...
```




Styling
===

These components are by default not using shadow-dom, so your standard 
CSS should work as expected also on the elements created by SWC. 

This also work well with global class-less stylesheets, see the example. 

To enable shadow-dom, you can use the `shadow` attribute on the 
custom element: 

```html
<supabase-table shadow source="my_table"></supabase-table>
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
