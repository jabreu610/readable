import React from 'react';
import {Route, Switch} from 'react-router-dom';

import Header from './header';
import Main from './main';
import PostDetails from './post-details';

const App = () => {
    return (
        <div>
            <Header/>
            <Switch>
                <Route path="/post/:id" component={PostDetails} />
                <Route path="/" component={Main} />
            </Switch>
        </div>
    )
}

export default App;
