import { useState } from "react";
import { NavLink } from "react-router-dom";
import { HamburgetMenuClose, HamburgetMenuOpen } from "../../assets/icons.js";
const Navbar = () => {
    const [click, setClick] = useState(false);

    const handleClick = () => setClick(!click);
    return (
        <>
            <nav className="navbar">
                <div className="nav-container">
                    <NavLink exact to="/" className="nav-logo">
                        <span>Hi Admin</span>
                    </NavLink>

                    <ul className={click ? "nav-menu active" : "nav-menu"}>
                        <li className="nav-item">
                            <NavLink
                                exact
                                to="/admin"
                                activeClassName="active"
                                className="nav-links"
                                onClick={handleClick}
                            >
                                Dashboard
                            </NavLink>
                        </li>
                        <div class="dropdown">
                            <button class="nav-links dropbtn">Manage Students
                            </button>
                            <div class="dropdown-content">
                                <NavLink
                                    exact
                                    to="/addStudent"
                                    activeClassName="active"
                                    className="nav-links"
                                    onClick={handleClick}
                                >
                                    Add Student
                                </NavLink>
                                <NavLink
                                    exact
                                    to="/editStudent"
                                    activeClassName="active"
                                    className="nav-links"
                                    onClick={handleClick}
                                >
                                    Edit Student
                                </NavLink>
                                <NavLink
                                    exact
                                    to="/deleteStudent"
                                    activeClassName="active"
                                    className="nav-links"
                                    onClick={handleClick}
                                >
                                    Delete Student
                                </NavLink>
                            </div>
                        </div>
                        <li className="nav-item">
                            <NavLink
                                exact
                                to="/profile"
                                activeClassName="active"
                                className="nav-links"
                                onClick={handleClick}
                            >
                                Profile
                            </NavLink>
                        </li>
                    </ul>
                    <div className="nav-icon" onClick={handleClick}>

                        {click ? (
                            <span className="icon">
                                <HamburgetMenuClose />
                            </span>
                        ) : (
                            <span className="icon">

                                <HamburgetMenuOpen />{" "}
                            </span>
                        )}
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;