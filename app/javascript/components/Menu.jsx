import React from 'react';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import 'bulma/css/bulma.css';
import { Navbar, NavbarMenu, NavbarStart, NavbarEnd, NavbarLink, NavbarBrand, NavbarDropdown, NavbarItem, Icon, TabList, Tabs, TabLink, Tab, } from 'bloomer';
import '../../assets/stylesheets/menu.css';
import logo from '../../assets/images/logo-w-t.png';


const Menu = (props) => {
    const handleLink = () => {
        axios.delete('/logout', { withCredentials: true })
            .then(response => {
                props.handleLogout();
                props.history.push('/');
            })
            .catch(error => console.log(error))
    }
    return (
        <Navbar className="is-fixed-top">
            <NavbarBrand>
                <NavbarItem>
                    <img id="logo" src={logo} />
                </NavbarItem>
            </NavbarBrand>
            <NavbarMenu isActive>
                <NavbarStart>
                    <Tabs>
                        <TabList>
                            <Tab onClick={props.handleSelected} isActive={props.searchSelect}>
                                <TabLink name="search">
                                    <Icon className="fa fa-search fa-lg"></Icon>
                                </TabLink>
                            </Tab>
                            <Tab onClick={props.handleSelected} isActive={props.homeSelect}>
                                <TabLink name="home">
                                    <Icon className="fa fa-home fa-lg"></Icon>
                                </TabLink>
                            </Tab>
                            <Tab onClick={props.handleSelected} isActive={props.likesSelect}>
                                <TabLink name="likes">
                                    <Icon className="fa fa-heart fa-lg"></Icon>
                                </TabLink>
                            </Tab>
                        </TabList>
                    </Tabs>
                </NavbarStart>
                <NavbarEnd>
                    <NavbarItem id="personal" isActive={props.userSelect} hasDropdown isHoverable>
                        <NavbarLink name="profile" onClick={props.handleSelected} >
                            <Icon isSize="small" className="fa fa-user"></Icon>
                        </NavbarLink>
                        <NavbarDropdown isHidden="touch">
                            <NavbarItem onClick={handleLink}>Logout</NavbarItem>
                        </NavbarDropdown>
                    </NavbarItem>
                </NavbarEnd>
            </NavbarMenu>
        </Navbar>
    );
};

export default Menu;