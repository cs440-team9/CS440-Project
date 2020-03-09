import React, { Component } from 'react';
import { serverURL } from '../App';

export class Home extends Component {
	render () {
		return (
            <div>
				<h1>Hello, world!</h1>
				<br/>
				<p>This is our library database Project for CS 440</p>

				<br /><br />

				<p>Our server is located at : <code>&nbsp;&nbsp;{serverURL}</code></p>
            </div>
		);
	}
}