import React, { Component } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import firebase from '../firebase';
import {List, LoadingList} from './List';
import { NonIdealState } from '@blueprintjs/core';
import './Board.css';

export default class Board extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
        };
    };

    reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
    
        return result;
    };

    move = (source, destination, droppableSource, droppableDestination) => {
        const sourceClone = Array.from(source);
        const destClone = Array.from(destination);
        const [removed] = sourceClone.splice(droppableSource.index, 1);
    
        destClone.splice(droppableDestination.index, 0, removed);
    
        const result = {};
        result[droppableSource.droppableId] = sourceClone;
        result[droppableDestination.droppableId] = destClone;
    
        return result;
    };

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
    };

    renderLists() {
        const lists = Object.entries(this.props.lists);

        if (0 === lists.length) {
            return <NonIdealState
                description="Görüntülenecek veri yok."
                visual="clipboard"
            />;
        }
        
        return <DragDropContext onDragEnd={this.onDragEnd}>
        {
            lists.map(list => (
                <List
                    id={list[0]}
                    key={list[0]}
                    title={list[1].title}
                    items={list[1].items}
                    width={300}
                />
            ))
        }
        </DragDropContext>;
    };

    render() {
        const { lists, fetching } = this.props;
        return (
            <div className="Board">
                {
                    fetching ? (
                        <LoadingList length={3} />
                    ) : (
                        this.renderLists()
                    )
                }
                
            </div>
        );
    };
}