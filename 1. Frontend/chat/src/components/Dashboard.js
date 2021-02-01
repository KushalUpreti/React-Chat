import Header from '../shared/Header';
import Container from '../shared/Container';
import EdgeContainer from '../shared/EdgeContainer';
import UserInfo from '../shared/UserInfo';

import { } from '../contexts/auth-context';

function Dashboard() {
    return <>
        <Header title="React Chat" caption="Wauu nice nice" />
        <Container>
            <EdgeContainer margin="12px 5px 12px 0">
                <UserInfo />
            </EdgeContainer>
        </Container>

    </>;
}

export default Dashboard;