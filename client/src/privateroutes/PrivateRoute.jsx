import React, {useContext, useState} from 'react'
import {Context} from '../context/Context'
import { Route, useHistory, useLocation} from 'react-router-dom'
export function PrivateRoute(props) {
    const history = useHistory()
    const location = useLocation()
    const {user} = useContext(Context)
    const setRoute = () => {
        
        if(user === null || user.verified === false)
            history.push('/login')
        return <Route path={props.path} component={props.component} />

    }
    return (
        setRoute()
    )
}
