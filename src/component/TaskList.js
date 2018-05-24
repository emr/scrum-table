import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Task from './Task';
import TaskForm from './TaskForm';
import { Classes, Intent } from '@blueprintjs/core';
import './TaskList.css';

export class TaskList extends Component {
    render() {
        const { id, title, items, story } = this.props;
        return (
            <div className="TaskList">
                <h2 className="TaskList-Head">{title}</h2>
                <div className="TaskList-Body">
			        <div style={{ margin: 10 }}>
                        <TaskForm
                            label="Add a new task"
                            listId={id}
                            story={story}
                            buttonProps={{
                                intent: Intent.NONE,
                                fill: true,
                                large: true,
                            }}
                        />
                    </div>
                    <Droppable droppableId={id}>
                        {(provided, snapshot) => (
                            <div
                                className="TaskList-Drag-Container"
                                ref={provided.innerRef}
                            >
                                {items.map((item, index) => (
                                    <Draggable
                                        key={item.id}
                                        draggableId={item.id}
                                        index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <Task {...{item}} listId={id} />
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </div>
        );
    }
}

export class LoadingList extends Component {
    static defaultProps = {
        length: 1
    }
    render() {
        const { length } = this.props;
        return Array.from({length}).map((v, list) => (
            <div className="TaskList" key={list} style={{background: 'none'}}>
                <div
                    className={Classes.SKELETON}
                    style={{
                        height: 30,
                        margin: 10,
                    }}
                ></div>
                <hr/>
                {Array.from({length: 3}).map((v, task) => (
                    <div
                        key={list*task+task}
                        className={Classes.SKELETON}
                        style={{
                            height: 50,
                            margin: 10,
                        }}
                    >
                    </div>
                ))}
            </div>
        ));
    }
}

export default TaskList;