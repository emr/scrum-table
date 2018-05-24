import React, { Component } from 'react';
import firebase from '../firebase';
import TaskForm from './TaskForm';
import { Card, ButtonGroup, Button } from '@blueprintjs/core';
import './Task.css';

export default class Task extends Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			deleting: false,
			doneMarked: props.item.done,
		}
        this.tasksDbRef = firebase.database().ref(`lists/${props.listId}/items`);
	}
	delete = () => {
		this.setState({ deleting: true });
		this.tasksDbRef.child(this.props.item.id).remove();
	}
	toggleDoneMark = () => {
		this.tasksDbRef.child(this.props.item.id).update({ done: !this.state.doneMarked });
		this.setState({ doneMarked: !this.state.doneMarked });
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
								icon={doneMarked ? 'saved' : 'document'}
								text={doneMarked ? 'Not done' : 'Done'}
								onClick={this.toggleDoneMark}
							/>
						</ButtonGroup>
					</div>
					<div className="Task-Title">{item.title}</div>
					<div className="Task-Description">{item.content}</div>
				</Card>
			</div>
		);
	}
}
