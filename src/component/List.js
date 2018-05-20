import React, { Component } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import Note from './Note';
import { Classes } from '@blueprintjs/core';
import './List.css';

export class List extends Component {
    render() {
        const { id, title, items } = this.props;
        return (
            <div className="List">
                <h2 className="List-Head">{title}</h2>
                <Droppable droppableId={id}>
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={{
                                height: '100%'
                            }}
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
                                            <Note {...item} />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
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
            <div className="List" key={list} style={{background: 'none'}}>
                <div
                    className={Classes.SKELETON}
                    style={{
                        height: 30,
                        margin: 10,
                    }}
                ></div>
                <hr/>
                {Array.from({length: 3}).map((v, note) => (
                    <div
                        key={list*note+note}
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

export default List;