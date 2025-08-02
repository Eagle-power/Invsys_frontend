import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <main className="App" onContextMenu={(e) => e.preventDefault()}>
            <Outlet />
        </main>
    );
}

export default Layout;