import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { TaskList, LoadingList } from './TaskList';
import StoryList from './StoryList';
import { NonIdealState } from '@blueprintjs/core';
import './Board.css';

export default class Board extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedStory: 0,
        };
    }

    reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
    
        return result;
    }

    move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);
    
        destClone.splice(droppableDestination.index, 0, removed);
    
        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;
    
        return result;
    }

    onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        this.props.unlockSave();

        if (source.droppableId === destination.droppableId) {
            this.props.lists[source.droppableId].items = this.reorder(
                this.props.lists[source.droppableId].items,
                source.index,
                destination.index
            );
            
            this.forceUpdate();
        }
        else {
            const result = this.move(
                this.props.lists[source.droppableId].items,
                this.props.lists[destination.droppableId].items,
                source,
                destination
            );

            this.props.lists[source.droppableId].items = result[source.droppableId];
            this.props.lists[destination.droppableId].items = result[destination.droppableId];

            this.forceUpdate();
        }
    }

    renderLists() {
        if (0 === this.props.stories.length)
            return;

        const lists = Object.entries(this.props.lists);
        const { selectedStory } = this.state;

        return <DragDropContext onDragEnd={this.onDragEnd}>
        {
            lists.map(list => (
                <TaskList
                    id={list[0]}
                    key={list[0]}
                    story={selectedStory}
                    title={list[1].title}
                    items={list[1].items.filter(item => item.story === selectedStory)}
                    width={300}
                />
            ))
        }
        </DragDropContext>;
    }
    
    handleStoryChange = (selected) => {
        this.setState({
            selectedStory: parseInt(selected.split('story-')[1])
        });
    }

    render() {
        const lists = Object.entries(this.props.lists);
        const { fetching, stories } = this.props;
        return (
            <div className="Board">
                {
                    fetching ? <LoadingList length={3} />
                    : (
                        lists.length > 0 ?
                        [
                            <StoryList
                                onChange={this.handleStoryChange}
                                stories={stories}
                                selected={this.state.selectedStory}
                            />,
                            this.renderLists()
                        ]
                        :
                        <NonIdealState
                            description="Görüntülenecek veri yok."
                            visual="clipboard"
                        />
                    )
                }
            </div>
        );
    }
}