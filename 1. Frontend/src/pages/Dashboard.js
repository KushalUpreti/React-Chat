import { Redirect, Route, Switch } from 'react-router-dom'

import Header from '../components/Sections/Header/Header';
import Container from '../components/Container/Container';
import LeftDiv from '../components/Sections/LeftDiv';
import MidDiv from '../components/Sections/MidDiv/MidDiv';
import RightDiv from '../components/Sections/RightDiv';

function Dashboard() {

    return <>
        <Header title="React Chat" caption="Keep in touch" />
        <Container>
            <LeftDiv />
            <Switch>
            <Route path="/messages" exact>
                <MidDiv />
            </Route>
            <Redirect to="/"/>
            </Switch>

            <RightDiv />
        </Container>
    </>;
}

export default Dashboard;