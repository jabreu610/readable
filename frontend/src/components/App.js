import React from "react";
import { Route, Switch } from "react-router-dom";

import Header from "./header";
import Main from "./main";
import PostDetails from "./post-details";
import EditPost from "./edit-post";
import NotFound from "./not-found"

const App = () => {
    return (
        <div>
            <Header />
            <Switch>
                <Route path="/post/form/new" component={EditPost} />
                <Route path="/post/form/:id" component={EditPost} />
                <Route exact path="/404" component={NotFound} />
                <Route path="/:category/:id" component={PostDetails} />
                <Route path="/:category" component={Main} />
                <Route exact path="/" component={Main} />
            </Switch>
        </div>
    );
};

export default App;
