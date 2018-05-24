import React from 'react';
import firebase from '../firebase';
import { Intent, Tabs, Tab, ButtonGroup, Button } from '@blueprintjs/core';
import StoryForm from './StoryForm';
import './StoryList.css';

export default class StoryList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.storiesDbRef = firebase.database().ref('stories');
    }
    deleteStory = story => {
        this.storiesDbRef.child(story.id).remove();
    }
    render() {
        const { selected, stories, onChange } = this.props;
        return (
            <div className="Stories">
                <h2 className="Stories-Head">Stories</h2>
			        <div style={{ margin: '20px 15px 5px' }}>
                        <StoryForm
                            label="Add a new story"
                            buttonProps={{
                                intent: Intent.PRIMARY,
                                fill: true,
                                large: true,
                            }}
                        />
                    </div>
                <Tabs
                    className="Stories-Tabs"
                    vertical={true}
                    large={true}
                    onChange={onChange}
                    selectedTabId={`story-${selected}`}
                >
                {
                    stories.map((story, i) => (
                        <Tab
                            className="Story-Tab"
                            id={`story-${i}`}
                            key={`story-${i}`}
                            title={
                                <div>
                                    <h4>{story.title}</h4>
                                    <hr style={{ margin: 0 }} />
                                    <div>{story.content}</div>
                                    <div className="Story-Tab-Tools">
                                        <ButtonGroup>
                                            <Button
                                                icon="trash"
                                                onClick={() => this.deleteStory(story)}
                                            />
                                        </ButtonGroup>
                                    </div>
                                </div>
                            }
                        />
                    ))
                }
                </Tabs>
            </div>
        );
    }
}