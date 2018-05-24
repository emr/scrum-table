import React, { Component } from 'react';
import firebase from '../firebase';
import {
	Intent, Classes,
	Dialog,
	Label, Button, TextArea, InputGroup, Switch,
} from '@blueprintjs/core';
import { DatePicker } from "@blueprintjs/datetime";

const emptyForm = {
	id: null,
	title: '',
	content: '',
	date: new Date(),
	person: '',
	done: null,
};

export default class TaskForm extends Component {
	constructor(props, context) {
		super(props, context);
		const form = props.form || this.getEmptyForm();
		this.state = {
			dialog: false,
			saving: false,
			form,
		};
        this.tasksDbRef = firebase.database().ref(`lists/${props.listId}`).child('items');
	}
	toggleDialog = () => this.setState({ dialog: !this.state.dialog });
	updateFormValue = (value) => {
		this.setState({
			form: Object.assign(this.state.form, {...value})
		});
	}
	getEmptyForm = () => Object.assign({story: this.props.story}, emptyForm);
	save = () => {
		const { form } = this.state;
		this.setState({ saving: true });
		if (form.id)
			this.tasksDbRef.child(form.id).update(form)
				.then(() => {
					this.toggleDialog();
					this.setState({
						saving: false,
					});
				})
			;
		else
			this.tasksDbRef.push(form)
				.then(() => {
					this.toggleDialog();
					this.setState({
						saving: false,
						form: this.getEmptyForm(),
					});
				})
			;

	}
	render() {
		const { form, saving } = this.state;
		const { label, buttonText, buttonProps, dialogProps } = this.props;
		return [
			<Button
				key="button"
				icon="document"
				text={label || buttonText}
				onClick={this.toggleDialog}
				{...buttonProps}
			/>,
			<Dialog
				key="form-dialog"
				icon="new-text-box"
				isOpen={this.state.dialog}
				onClose={this.toggleDialog}
				title={label}
				{...dialogProps}
			>
				<div className={Classes.DIALOG_BODY}>
					<Label text="Task title">
						<InputGroup
							leftIcon="label"
							value={form.title}
							onChange={e => this.updateFormValue({title: e.target.value})}
						/>
					</Label>
					<Label text="Task description">
						<TextArea
							large={true}
							intent={Intent.PRIMARY}
							onChange={e => this.updateFormValue({content: e.target.value})}
							value={form.content}
							fill={true}
						/>
					</Label>
					<Label text="Person in charge">
						<InputGroup
							value={form.person}
							onChange={e => this.updateFormValue({person: e.target.value})}
							leftIcon="person"
						/>
					</Label>
					<Label text="Date ended" style={{ display: 'inline-block' }}>
						<DatePicker
							className={Classes.ELEVATION_1}
							showActionsBar={true}
							onChange={date => this.updateFormValue({date})}
						/>
					</Label>
					<hr/>
					<Switch
						checked={form.done}
						label="Completed"
						onChange={e => this.updateFormValue({ done: !form.done })}
					/>
				</div>
				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button text="Cancel" onClick={this.toggleDialog} />
						<Button
							intent={Intent.SUCCESS}
							loading={saving}
							onClick={() => {
								this.save();
							}}
							text="Save"
						/>
					</div>
				</div>
			</Dialog>
		];
	}
}