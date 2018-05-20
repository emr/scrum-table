import React, { Component } from 'react';
import {Card} from '@blueprintjs/core';
import './Note.css';

export default class Note extends Component {
	render() {
		return (
			<div className="Note">
				<Card interactive={true}>{this.props.content}</Card>
			</div>
		);
	}
}