import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Layout, Menu, Icon } from 'antd';

import { Home } from './components/Home';
import { About } from './components/About';

import styles from './CSS/App.module.css';

export const serverURL = "http://access.engr.oregonstate.edu:8088/"

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default class App extends Component {
	constructor() {
		super();

		// Get the current page for the menu
		var URL = window.location.href;

		var page = '1';
		var subMenu = '';

		/* This is a really messy way of doing this, but it doesn't really matter. */
		if (URL.includes('about')) {
			page = '2';
		}

		this.state = {
			collapsed: false,
			currentPage: page,
			currentSubMenu: subMenu
		};
	};

	onCollapse = (collapsed) => {
		this.setState({ collapsed });
	}

	toggle = () => {
		this.setState({
			collapsed: !this.state.collapsed
		});
	}

	menuSwap = (obj) => {
		this.setState({ currentPage: obj.key });
	}

	render() {
		var { collapsed, currentPage, currentSubMenu } = this.state;

		return (
			<Router>
				<Header className={styles.AppHeader}>
					CS 440 Project Website
				</Header>

				<Layout className={styles.AppLayout}>
					<Sider
						collapsible
						onCollapse={this.onCollapse}
						collapsed={collapsed}
					>
						<Menu
							theme="dark"
							defaultSelectedKeys={[currentPage]}
							defaultOpenKeys={[currentSubMenu]}
							mode="inline"
						>
							<Menu.Item key="1" onClick={this.menuSwap}>
								<Icon type="home" className={styles.MenuIcon} />
								<span>Home</span>
								<Link to="/" />
							</Menu.Item>
							<Menu.Item key="2" onClick={this.menuSwap}>
								<Icon type="info-circle" className={styles.MenuIcon} />
								<span>About</span>
								<Link to="/about" />
							</Menu.Item>
						</Menu>
					</Sider>

					<Layout>
						<Content className={styles.AppContent}>
							<Route exact path="/" component={Home} />
							<Route exact path="/about" component={About} />
						</Content>
						<Footer className={styles.AppFooter}>
							Ant Design &copy;2016 Created by Ant UED
						</Footer>
					</Layout>
				</Layout>
			</Router>
		);
	}
}
