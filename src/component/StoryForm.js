import React, { Component } from 'react';
import firebase from '../firebase';
import {
	Intent, Classes,
	Dialog,
	Label, Button, TextArea, InputGroup,
} from '@blueprintjs/core';

const emptyForm = {
	id: null,
	title: '',
	text: '',
};

const getEmptyForm = () => Object.assign({}, emptyForm);

export default class StoryForm extends Component {
	constructor(props, context) {
		super(props, context);
		const form = props.form || getEmptyForm();
		this.state = {
			dialog: false,
			saving: false,
			form,
		};
        this.storiesDbRef = firebase.database().ref('stories');
	}
	toggleDialog = () => this.setState({ dialog: !this.state.dialog });
	updateFormValue = (value) => {
		this.setState({
			form: Object.assign(this.state.form, {...value})
		});
	}
	save = () => {
		const { form } = this.state;
		this.setState({ saving: true });
		if (form.id)
			this.storiesDbRef.child(form.id).update(form)
				.then(() => {
					this.toggleDialog();
					this.setState({
						saving: false,
					});
				})
			;
		else
			this.storiesDbRef.push(form)
				.then(() => {
					this.toggleDialog();
					this.setState({
						saving: false,
						form: getEmptyForm(),
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
				icon="new-text-box"
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
					<Label text="Story title">
						<InputGroup
							leftIcon="label"
							value={form.title}
							onChange={e => this.updateFormValue({title: e.target.value})}
						/>
					</Label>
					<Label text="Story text">
						<TextArea
							large={true}
							intent={Intent.PRIMARY}
							onChange={e => this.updateFormValue({content: e.target.value})}
							value={form.content}
							fill={true}
						/>
					</Label>
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