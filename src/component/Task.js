import React, { Component } from 'react';
import firebase from '../firebase';
import moment from 'moment';
import TaskForm from './TaskForm';
import { Icon, Card, ButtonGroup, Button } from '@blueprintjs/core';
import './Task.css';

export default class Task extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			deleting: false,
		}
        this.tasksDbRef = firebase.database().ref(`lists/${props.listId}/items`);
	}
	delete = () => {
		this.setState({ deleting: true });
		this.tasksDbRef.child(this.props.item.id).remove();
	}
	toggleDoneMark = () => {
		this.props.item.done = !this.props.item.done;
		this.forceUpdate();
	}
	render() {
		const { item, listId } = this.props;
		const { deleting, doneMarked } = this.state;
		return (
			<div className="Task">
				<Card interactive={true}>
					<div className="Task-Tools">
						<ButtonGroup>
							<TaskForm
								label="Edit task"
								buttonProps={{
									icon: 'edit',
									text: false,
								}}
								form={item}
								story={item.story}
								listId={listId}
							/>
							<Button
								icon="trash"
								onClick={this.delete}
								loading={deleting}
							/>
							<Button
								icon={item.done ? 'saved' : 'document'}
								text={item.done ? 'Not done' : 'Done'}
								onClick={this.toggleDoneMark}
							/>
						</ButtonGroup>
					</div>
					<div className="Task-Title">{item.title}</div>
					<div className="Task-Description">{item.content.split('\n').map(c => <div>{c}</div>)}</div>
					<div className="Task-Person">
						<Icon icon="person" />
						&nbsp;
						&nbsp;
						{item.person}
					</div>
					<div className="Task-Date">
					    <Icon icon={item.done ? 'updated' : 'time'} />
						&nbsp;
						&nbsp;
						{moment(item.date).endOf('hour').fromNow()}
					</div>
				</Card>
			</div>
		);
	}
}
