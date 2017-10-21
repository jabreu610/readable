import React from "react";
import { Route, Switch } from "react-router-dom";

import Header from "./header";
import Main from "./main";
import PostDetails from "./post-details";
import NewPost from "./new-post";

const App = () => {
    return (
        <div>
            <Header />
            <Switch>
                <Route path="/post/form/new" component={NewPost} />
                <Route path="/post/form/:id" component={NewPost} />
                <Route path="/post/:id" component={PostDetails} />
                <Route path="/" component={Main} />
            </Switch>
        </div>
    );
};

export default App;
