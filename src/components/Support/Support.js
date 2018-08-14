import React from 'react';

import classes from './Support.css';

/**
 * This is pure HTML to create the 'Support LiquidLab' page
 * @returns {*}
 */
const support = () => (
    <div className={classes.Support}>
        <header>Authentication Template</header>
        <h3>Version 0.1</h3>
        <h3>Created by Matthew Wayles</h3>
        <hr />
        <p>This is an "Support Our Product/Company" placeholder page for any project/website that uses this
            authentication template.</p>
        <h1>Support Authentication Template</h1>
        <p>This template works out of the box to provide a strong token-based authenticated application shell
        that any full-scale web or mobile app can be built off of. It uses React.js framework to offer an easy to
            understand structure that is built to scale. No back-end services are provided, except links to Google Firebase
        functions with the API KEY removed.</p>
        <h1>Customizing Authentication Template</h1>
        <p>Authentication Template is a basic authentication shell, but the following customizations can be made to the
        existing codebase:</p>
        <ul>
            <li>Modify the <code>:root</code> element in <code>index.css</code> to globally change theme colors.</li>
            <li>Change the header label values in <code>Auth.js</code></li>
            <li>Modify routes in <code>App.js</code></li>
            <li>Add new navigational links in <code>NavigationItems.js</code> add set their routes based on
                authentication in <code>App.js</code> </li>
            <li>Replace <code>Main.js</code> with the Main page of your own application</li>
            <li>Include your own logo in <code>Logo.js</code></li>
            <li>Customize the AJAX spinner for asynchronous requests in <code>Spinner.js</code></li>
        </ul>
        <hr />
        <p>Use of this application is free, no acknowledgement required. Please feel free to modify or optimize the
        code and submit a pull request to <a href="https://github.com/mattwayles/authtemplate">GitHub</a></p>
    </div>
);

export default support;