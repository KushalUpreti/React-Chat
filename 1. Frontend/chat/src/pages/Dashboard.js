import { Route } from 'react-router-dom'

import Header from '../components/Header';
import Container from '../components/Container';
import LeftDiv from '../components/LeftDiv';
import MidDiv from '../components/MidDiv';
import RightDiv from '../components/RightDiv';

function Dashboard() {

    return <>
        <Header title="React Chat" caption="Wauu nice nice" />
        <Container>
            <LeftDiv />
            <Route path="/messages">
                <MidDiv />
            </Route>
            <RightDiv />
        </Container>
    </>;
}

export default Dashboard;