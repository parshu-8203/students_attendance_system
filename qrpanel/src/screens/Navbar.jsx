const Navbar = ({ onLogout }) => {
    const handleLogout= () =>{
        onLogout();
    }
    return (
        <nav className="navbar">
            <div className="nav-container">
                <h2 style={{color: '#DCE2F0'}}>Hello Admin!!</h2>
                <button class="navbar-button" onClick={handleLogout}>Logout</button>
            </div>
        </nav>
    );

}

export default Navbar;