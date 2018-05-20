import React from 'react'
import { app } from '../config';
import {
    Classes, Alignment,
    Navbar, NavbarGroup, NavbarHeading, NavbarDivider,
    Popover, Menu, MenuItem,
    Button, Icon,
} from '@blueprintjs/core';

export default class AppNavbar extends React.Component {
    render() {
        const { user, handleSignOut, saving, saved, synchronize } = this.props;
        return (
            <Navbar className={Classes.DARK}>
                <NavbarGroup align={Alignment.LEFT}>
                    <NavbarHeading>{app.name}</NavbarHeading>
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <NavbarDivider/>
                    <Button minimal={true} icon="info-sign" />
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <NavbarDivider/>
                    {
                        saved || saving ? <Button minimal={true} disabled={true} icon="saved" text={saved ? 'Saved' : 'Saving'} />
                        : <Button minimal={true} icon="floppy-disk" text="Save" onClick={synchronize} />
                    }
                </NavbarGroup>
                <NavbarGroup align={Alignment.RIGHT}>
                    <Popover
                        minimal={true}
                        content={
                            <Menu>
                                <MenuItem text="Signout" labelElement={<Icon icon="log-out"/>} onClick={handleSignOut} />
                            </Menu>
                        }
                    >
                        <Button minimal={true} icon="user" text={user.email} />
                    </Popover>
                </NavbarGroup>
            </Navbar>
        );
    }
}